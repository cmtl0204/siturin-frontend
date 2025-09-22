import { Component, effect, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { PeopleCapacityComponent } from '../shared/people-capacity/people-capacity.component';
import { PhysicalSpaceComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/park/shared/physical-space/physical-space.component';
import { CoreEnum } from '@utils/enums';
import { ParkHttpService } from '@modules/core/roles/external/services/park-http.service';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';

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
    private readonly parksHttpService = inject(ParkHttpService);

    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(PeopleCapacityComponent) private peopleCapacityComponent!: QueryList<PeopleCapacityComponent>;

    private mainData: Record<string, any> = {};
    protected modelId: string | undefined = undefined;

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

    ngOnInit(): void {}

    saveForm(data: any, objectName?: string) {
        if (objectName) {
            if (!this.mainData[objectName]) {
                this.mainData[objectName] = {};
            }

            this.mainData[objectName] = { ...this.mainData[objectName], ...data };
        } else {
            this.mainData = { ...this.mainData, ...data };
        }
    }

    async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    async saveProcess() {
        const sessionData = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        const payload = { ...this.mainData, ...sessionData };

        this.parksHttpService.createRegistration(payload).subscribe({
            next: () => {}
        });
    }

    checkFormErrors() {
        const errors: string[] = [...this.physicalSpaceComponent.toArray().flatMap((c) => c.getFormErrors()), ...this.peopleCapacityComponent.toArray().flatMap((c) => c.getFormErrors())];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
