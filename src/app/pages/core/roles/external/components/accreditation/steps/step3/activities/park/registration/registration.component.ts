import { Component, effect, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CoreEnum } from '@utils/enums';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { PeopleCapacityComponent } from '../shared/people-capacity/people-capacity.component';
import { PhysicalSpaceComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/park/shared/physical-space/physical-space.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { ParkHttpService } from '@modules/core/roles/external/services/park-http.service';

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [Button, PeopleCapacityComponent, PhysicalSpaceComponent, RegulationComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(PeopleCapacityComponent) private peopleCapacityComponent!: QueryList<PeopleCapacityComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    protected readonly PrimeIcons = PrimeIcons;
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly parksHttpService = inject(ParkHttpService);
    private readonly customMessageService = inject(CustomMessageService);

    private mainData: Record<string, any> = {};
    protected modelId?: string;

    constructor() {
        effect(async () => {
            const process = this.coreSessionStorageService.processSignal();

            if (!process) return;

            const candidates = [process.classification, process.category];
            const regulated = candidates.find((c) => c?.hasRegulation);

            if (regulated) {
                this.modelId = regulated.id;
            }
        });
    }

    ngOnInit(): void {}

    protected saveForm(data: any, objectName?: string) {
        const target = objectName ? (this.mainData[objectName] ?? {}) : this.mainData;

        const merged = { ...target, ...data };

        objectName ? (this.mainData[objectName] = merged) : (this.mainData = merged);
    }

    protected async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    private async saveProcess() {
        const sessionData = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        console.log(this.mainData);

        const payload = { ...this.mainData, ...sessionData };

        this.parksHttpService.createRegistration(payload).subscribe({
            next: () => {}
        });
    }

    private checkFormErrors() {
        const components = [...this.physicalSpaceComponent.toArray(), ...this.peopleCapacityComponent.toArray(), ...this.regulationComponent.toArray()];

        const errors = components.flatMap((c) => c.getFormErrors());

        if (errors.length) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
