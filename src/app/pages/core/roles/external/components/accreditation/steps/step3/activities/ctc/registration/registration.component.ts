import { Component, effect, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { TouristActivitiesComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/ctc/shared/tourist-activities/tourist-activities.component';
import { FoodDrinkComponent } from '../shared/food-drink/food-drink.component';
import { RequirementsComponent } from '../shared/requirements/requirements.component';
import { AccommodationComponent } from '../shared/accommodation/accommodation.component';
import { CommunityOperationComponent } from '../shared/community-operation/community-operation.component';
import { TouristGuideComponent } from '@modules/core/shared/components/tourist-guide/tourist-guide.component';
import { CtcHttpService } from '@modules/core/roles/external/services/ctc-http.service';
import { CoreEnum } from '@utils/enums';
import { TouristTransportCompanyCtcComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/ctc/shared/transport/transport.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';

@Component({
    selector: 'app-registration',
    imports: [FormsModule, ReactiveFormsModule, Button, RequirementsComponent, TouristActivitiesComponent, RegulationComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(RequirementsComponent) private requirementsComponent!: QueryList<RequirementsComponent>;
    @ViewChildren(TouristActivitiesComponent) private touristActivitiesComponent!: QueryList<TouristActivitiesComponent>;
    @ViewChildren(FoodDrinkComponent) private foodComponent!: QueryList<FoodDrinkComponent>;
    @ViewChildren(AccommodationComponent) private accommodationComponent!: QueryList<AccommodationComponent>;
    @ViewChildren(CommunityOperationComponent) private communityOperationComponent!: QueryList<CommunityOperationComponent>;
    @ViewChildren(TouristTransportCompanyCtcComponent) private touristTransportCompanyCtcComponent!: QueryList<TouristTransportCompanyCtcComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    protected activities: any[] = [];
    protected readonly ctcHttpService = inject(CtcHttpService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    @Input() modelId!: string | undefined;

    protected mainForm!: FormGroup;

    constructor() {
        this.mainForm = this.formBuilder.group({
            regulation: [null, Validators.required]
        });

        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                if (processSignal.classification?.hasRegulation) this.modelId = processSignal.classification.id;
                if (processSignal.category?.hasRegulation) this.modelId = processSignal.category.id;
            }
        });
    }

    saveForm(childForm: FormGroup): void {
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    async saveProcess() {
        const sessionData = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        console.log('sessionData', sessionData);
        console.log('mainForm.value', this.mainForm.value);

        const payload = {
            ...this.mainForm.value,
            ...sessionData
        };
        console.log(payload);
        this.ctcHttpService.createRegistration(payload).subscribe({
            next: () => {
                console.log('Creado');
            }
        });
    }

    checkFormErrors(): boolean {
        const errors: string[] = [
            ...this.requirementsComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristActivitiesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.foodComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.accommodationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.communityOperationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristTransportCompanyCtcComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.regulationComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    ngOnInit(): void {
        this.loadStoredData();
    }

    loadStoredData(): void {}
}
