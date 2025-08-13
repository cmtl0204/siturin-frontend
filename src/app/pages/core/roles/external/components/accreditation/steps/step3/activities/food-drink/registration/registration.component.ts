import { Component, effect, inject, QueryList, ViewChildren } from '@angular/core';
import { PhysicalSpaceComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/physical-space/physical-space.component';
import { TypeEstablishmentComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/establishment/type-establishment.component';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { CommonModule } from '@angular/common';
import { AdventureModalitiesComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/adventure-modalities/adventure-modalities.component';
import { EstablishmentCapacityComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/establishment-capacity/establishment-capacity.component';
import { EstablishmentServicesComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/establishment-services/establishment-services.component';
import { ClassificationInterface } from '@modules/core/shared/interfaces';
import { KitchenComponent } from '../shared/kitchen/kitchen.component';
import { CatalogueActivitiesCodeEnum, CatalogueProcessFoodDrinksClassificationEnum, CoreEnum } from '@/utils/enums';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { FoodDrinkHttpService } from '@/pages/core/roles/external/services';

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [CommonModule, Button, TypeEstablishmentComponent, PhysicalSpaceComponent, EstablishmentCapacityComponent, EstablishmentServicesComponent, KitchenComponent, RegulationComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(TypeEstablishmentComponent) private typeEstablishmentComponent!: QueryList<TypeEstablishmentComponent>;
    @ViewChildren(EstablishmentCapacityComponent) private establishmentCapacityComponent!: QueryList<EstablishmentCapacityComponent>;
    @ViewChildren(EstablishmentServicesComponent) private establishmentServicesComponent!: QueryList<EstablishmentServicesComponent>;
    @ViewChildren(KitchenComponent) private kitchenComponent!: QueryList<KitchenComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;

    protected showTypeEstablishment = false;
    protected hasLandUseValue = false;
    protected hideFields = false;

    protected modelId!: string | undefined;

    protected currentClassification!: ClassificationInterface | undefined;

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly foodDrinkHttpService = inject(FoodDrinkHttpService);

    protected activityCode = CatalogueActivitiesCodeEnum.food_drink_continent; // or food_drink_galapagos


    constructor() {
        this.mainForm = this.formBuilder.group({});

        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();
            if (processSignal) {
                this.currentClassification = processSignal.classification;
                if (this.currentClassification?.code === CatalogueProcessFoodDrinksClassificationEnum.plazas_comida || this.currentClassification?.code === CatalogueProcessFoodDrinksClassificationEnum.establecimiento_movil || this.currentClassification?.code === CatalogueProcessFoodDrinksClassificationEnum.discoteca) {
                    this.hideFields = true;
                }
                if (processSignal.classification?.hasRegulation) this.modelId = processSignal.classification.id;
                if (processSignal.category?.hasRegulation) this.modelId = processSignal.category.id;
            }
        });
    }

    saveForm(childForm: FormGroup) {
        if (childForm.contains('hasLandUse')) {
            const hasLandUseControl = childForm.get('hasLandUse');
            if (hasLandUseControl) {
                this.hasLandUseValue = hasLandUseControl.value === true;
                this.showTypeEstablishment = hasLandUseControl.value === true;
            }
        }
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    async onSubmit() {
        console.log(this.mainForm.value);
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    async saveProcess() {    

        const sessionData = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        const kitchenData = this.mainForm.get('kitchenTypes')?.value;

        const kitchenTypes = Array.isArray(kitchenData) 
        ? kitchenData.map(item => ({
            id: item.id,
            code: item.code
          }))
        : [];
        

        const serviceData = this.mainForm.get('serviceTypes')?.value;
        const serviceTypes = Array.isArray(serviceData) 
        ? serviceData.map(item => ({
            id: item.id,
            code: item.code 
          }))
        : [];
        console.log('mainForm.value', this.mainForm.value);
          
        const payload = {
            ...this.mainForm.value,
            ...sessionData,
            kitchenTypes,
            serviceTypes
        };
        console.log(payload);
        this.foodDrinkHttpService.createRegistration(payload).subscribe({
            next: () => {
                console.log('Creado');
            }
        });


    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.physicalSpaceComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.typeEstablishmentComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.establishmentCapacityComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.establishmentServicesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.kitchenComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.regulationComponent.toArray().flatMap((c) => c.getFormErrors())
        ];
        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
