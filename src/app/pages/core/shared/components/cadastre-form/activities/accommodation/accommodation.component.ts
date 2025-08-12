import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@/utils/services';
import { EstablishmentComponent } from '../../sections/establishment/establishment.component';
import { EstablishmentCapacityComponent } from "../food-drink/shared/establishment-capacity/establishment-capacity.component";
import { ComplementaryServicesComponent } from "./shared/complementary-services/complementary-services.component";
import { EstablishmentCapabilitiesComponent } from "./shared/establishment-capabilities/establishment-capabilities.component";
import { GroundLocalsComponent } from "./shared/ground-locals/ground-locals.component";
import { InactivationComponent } from "@/pages/core/roles/external/components/accreditation/steps/step3/activities/accommodation/inactivation/inactivation.component";
import { AdventureTourismModalityComponent } from "../../../adventure-tourism-modality/adventure-tourism-modality.component";
//import { ComplementaryServices } from "./shared/complementary-services/complementary-services";

@Component({
    selector: 'app-accommodation',
    imports: [
    ReactiveFormsModule,
    SelectModule,
    DividerModule,
    PanelModule,
    FluidModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    TagModule,
    ButtonModule,
    ComplementaryServicesComponent,
    EstablishmentCapabilitiesComponent,
    GroundLocalsComponent,
    AdventureTourismModalityComponent
],
    templateUrl: './accommodation.component.html',
    styleUrl: './accommodation.component.scss'
})
export class AccommodationComponent {
    protected readonly PrimeIcons = PrimeIcons;
    @Output() dataOut = new EventEmitter<FormGroup>();


    @ViewChildren(EstablishmentCapabilitiesComponent) private establishmentCapabilitiesComponent!: QueryList<EstablishmentCapabilitiesComponent>;
    @ViewChildren(ComplementaryServicesComponent) private complementaryServicesComponent!: QueryList<ComplementaryServicesComponent>;
    @ViewChildren(GroundLocalsComponent) private groundLocalsComponent!: QueryList<GroundLocalsComponent>;
    private formBuilder = inject(FormBuilder);



    protected mainForm!: FormGroup;

    protected readonly customMessageService = inject(CustomMessageService);

    constructor() {
        this.mainForm = this.formBuilder.group({});

    }

    saveForm(childForm: FormGroup) {
         Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }

        });

    }

    onSubmit() {
        if (!this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        console.log(this.mainForm.value);
    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.establishmentCapabilitiesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.groundLocalsComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.complementaryServicesComponent.toArray().flatMap((c) => c.getFormErrors()),
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    loadData(){}
    
}
