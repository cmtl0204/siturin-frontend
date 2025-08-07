import { Component, effect, inject, QueryList, ViewChildren } from '@angular/core';
import {
    PhysicalSpaceComponent
} from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/physical-space/physical-space.component';
import {
    TypeEstablishmentComponent
} from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/establishment/type-establishment.component';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { CommonModule } from '@angular/common';
import {
    AdventureModalitiesComponent
} from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/adventure-modalities/adventure-modalities.component';
import { ClassificationService } from '../shared/services/classification.service';
import {
    EstablishmentCapacityComponent
} from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/establishment-capacity/establishment-capacity.component';
import {
    EstablishmentServicesComponent
} from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/shared/establishment-services/establishment-services.component';
import { ClassificationInterface } from '@modules/core/shared/interfaces';
import { KitchenComponent } from '../shared/kitchen/kitchen.component';

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [CommonModule, Button, TypeEstablishmentComponent, PhysicalSpaceComponent, EstablishmentCapacityComponent, EstablishmentServicesComponent, KitchenComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(TypeEstablishmentComponent) private typeEstablishmentComponent!: QueryList<TypeEstablishmentComponent>;
    @ViewChildren(AdventureModalitiesComponent) private adventureModalitiesComponent!: QueryList<AdventureModalitiesComponent>;
    @ViewChildren(EstablishmentCapacityComponent) private establishmentCapacityComponent!: QueryList<EstablishmentCapacityComponent>;
    @ViewChildren(EstablishmentServicesComponent) private establishmentServicesComponent!: QueryList<EstablishmentServicesComponent>;
    @ViewChildren(KitchenComponent) private kitchenComponent!: QueryList<KitchenComponent>;

    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;

    protected showTypeEstablishment = false;

    private readonly classificationService = inject(ClassificationService);
    protected currentClassification!: ClassificationInterface | undefined;

    protected get shouldShowTypeEstablishment(): boolean {
        return this.showTypeEstablishment || this.currentClassification?.id === '5';
    }

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);

    constructor() {
        this.mainForm = this.formBuilder.group({});
        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                console.log(processSignal);
                this.currentClassification = processSignal.classification;
            }
        });
    }
    ngOnInit() {
        // this.subscription = this.classificationService.currentClassification.subscribe(
        //     classification => {
        //       this.currentClassification = classification;
        //       console.log('Classification updated:', this.currentClassification);
        //     }
        //   );
    }

    saveForm(childForm: FormGroup) {
        if (childForm.contains('landUse')) {
            this.showTypeEstablishment = childForm.get('landUse')?.value === true;
        }

        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    onSubmit() {
        console.log(this.mainForm.value);
        if (!this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        console.log(this.mainForm.value);
    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.physicalSpaceComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.typeEstablishmentComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.adventureModalitiesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.establishmentCapacityComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.establishmentServicesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.kitchenComponent.toArray().flatMap((c) => c.getFormErrors())
            // Add tables separates
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
