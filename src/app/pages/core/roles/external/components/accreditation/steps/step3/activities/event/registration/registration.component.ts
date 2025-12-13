import { Component, effect, inject, OnInit, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { ChildParkFormEnum, CoreEnum } from '@utils/enums';
import { EventHttpService } from '@modules/core/roles/external/services';
import { PeopleCapacityComponent } from '../shared/people-capacity/people-capacity.component';
import { PhysicalSpaceComponent } from '../shared/physical-space/physical-space.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [Button, PeopleCapacityComponent, PhysicalSpaceComponent, RegulationComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly eventHttpService = inject(EventHttpService);

    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(PeopleCapacityComponent) private peopleCapacityComponent!: QueryList<PeopleCapacityComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    private mainData: WritableSignal<Record<string, any>> = signal({});
    protected modelId: string | undefined = undefined;
    protected dataIn!: any;

    protected readonly customMessageService = inject(CustomMessageService);

    constructor() {
        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                if (processSignal.classification?.hasRegulation) this.modelId = processSignal.classification.id;
                if (processSignal.category?.hasRegulation) this.modelId = processSignal.category.id;
            }
        });
    }

    async ngOnInit(): Promise<void> {
        await this.loadDataIn();
    }

    private async loadDataIn() {
        this.dataIn = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step3);
    }

    protected saveForm(data: any, objectName?: string) {
        this.mainData.update((currentData) => {
            let newData = { ...currentData };

            if (objectName) {
                newData[objectName] = {
                    ...(newData[objectName] ?? {}),
                    ...data
                };
            } else {
                newData = { ...currentData, ...data };
            }

            return newData;
        });
    }

    async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    async saveProcess() {
        const sessionData = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.step3, this.mainData());

        const payload = { ...this.mainData(), ...sessionData };

        this.eventHttpService.createRegistration(payload).subscribe({
            next: () => {}
        });
    }

    checkFormErrors() {
        const errors = collectFormErrors([this.physicalSpaceComponent, this.peopleCapacityComponent, this.regulationComponent]);

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
