import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { TouristTransportCompanyComponent } from '../shared/touristTransportCompany/touristTransportCompany.component';
import { TouristActivitiesComponent } from '../tourist-activities/tourist-activities.component';
import { FoodDrinkComponent } from '../shared/food-drink/foodDrink.component';
import { RequirementsComponent } from '../shared/requirements/requirements.component';
import { AccommodationComponent } from '../shared/accommodation/accommodation.component';
import { CommunityOperationComponent } from '../shared/community-operation/community-operation.component';
import { TouristGuideComponent } from '@modules/core/shared/components/tourist-guide/tourist-guide.component';
import { CtcHttpService } from '@modules/core/roles/external/services/ctc-http.service';
import { CoreEnum } from '@utils/enums';

@Component({
    selector: 'app-registration',
    imports: [FormsModule, ReactiveFormsModule, Button, RequirementsComponent, TouristActivitiesComponent],
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
    @ViewChildren(TouristTransportCompanyComponent) private touristTransportCompanyComponent!: QueryList<TouristTransportCompanyComponent>;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    protected activities: any[] = [];
    protected readonly ctcHttpService = inject(CtcHttpService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    protected mainForm!: FormGroup;

    constructor() {
        this.mainForm = this.formBuilder.group({});
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
            ...this.touristTransportCompanyComponent.toArray().flatMap((c) => c.getFormErrors()),
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
