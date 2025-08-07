import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { DividerModule } from 'primeng/divider';
import { FoodVariablesComponent } from '../../independent-variables/food-drinks/food-variables.component';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { ProcedureComponent } from '../../sections/procedure/procedure.component';
import { EstablishmentComponent } from '../../sections/establishment/establishment.component';
import { LocationComponent } from '../../sections/location/location.component';
import { ContactPersonComponent } from '../../sections/contact-person/contact-person.component';
import { ButtonModule } from 'primeng/button';
import { EstablishmentStaffComponent } from "../../sections/establishment-staff/establishment-staff.component";
import { EstablishmentCapacityComponent } from './shared/establishment-capacity/establishment-capacity.component';
import { EstablishmentServicesComponent } from './shared/establishment-services/establishment-services.component';
import { AdventureModalitiesComponent } from "../../sections/adventure-modalities/adventure-modalities.component";
import { CadastreComponent } from "../../sections/cadastre/cadastre.component";

@Component({
    selector: 'app-food',
    imports: [
    ProcedureComponent,
    EstablishmentComponent,
    PanelModule,
    FluidModule,
    DividerModule,
    LocationComponent,
    ContactPersonComponent,
    ButtonModule,
    EstablishmentStaffComponent,
    EstablishmentServicesComponent,
    EstablishmentCapacityComponent,
    AdventureModalitiesComponent,
    CadastreComponent
],
    templateUrl: './food.component.html',
    styleUrl: './food.component.scss'
})
export class FoodComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(ProcedureComponent) private procedureComponent!: QueryList<ProcedureComponent>;
    @ViewChildren(EstablishmentComponent) private establishmentComponent!: QueryList<EstablishmentComponent>;
    @ViewChildren(LocationComponent) private locationComponent!: QueryList<LocationComponent>;
    @ViewChildren(ContactPersonComponent) private contactPersonComponent!: QueryList<ContactPersonComponent>;
    @ViewChildren(EstablishmentStaffComponent) private establishmentStaffComponent!: QueryList<EstablishmentStaffComponent>;
    @ViewChildren(EstablishmentCapacityComponent) private establishmentCapacityComponent!: QueryList<EstablishmentCapacityComponent>;
    @ViewChildren(EstablishmentServicesComponent) private establishmentServicesComponent!: QueryList<EstablishmentServicesComponent>;
    @ViewChildren(AdventureModalitiesComponent) private adventureModalitiesComponent!: QueryList<AdventureModalitiesComponent>;
    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;

    //protected readonly customMessageService = inject(CustomMessageService);

    constructor() {
        this.mainForm = this.formBuilder.group({
            procedure: [null],
            establishment: [null],
            location: [null],
            contactPerson: [null],
            establishmentStaff: [null],
            establishmentServices: [null],
            establishmentCapacity: [null],
            adventureModalities: [null]
        });
    }

    saveForm(childForm: FormGroup, componentName: string) {
        /* Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        }); */

        switch (componentName) {
            case 'procedure':
                this.procedureField.patchValue(childForm.value);
                break;

            case 'establishment':
                this.establishmentField.patchValue(childForm.value);
                break;

            case 'location':
                this.locationField.patchValue(childForm.value);
                break;

            case 'contact-person':
                this.contactPersonField.patchValue(childForm.value);
                break;

            case 'establishment-staff':
                this.establishmentStaffField.patchValue(childForm.value);
                break;

            case 'establishmentCapacity':
                this.establishmentCapacityField.patchValue(childForm.value);
                break;

            case 'establishmentServices':
                this.establishmentServicesField.patchValue(childForm.value);
                break;
            case 'adventureModalities':
                this.adventureModalitiesField.patchValue(childForm.value);
                break;


        }
        console.log('Form1 updated:', this.mainForm.value);
        console.log('Form2 updated:', childForm.value);
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
            ...this.procedureComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.establishmentComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.locationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.contactPersonComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.establishmentStaffComponent.toArray().flatMap((c) => c.getFormErrors()),   
            ...this.establishmentCapacityComponent.toArray().flatMap((c) => c.getFormErrors()),   
            ...this.establishmentServicesComponent.toArray().flatMap((c) => c.getFormErrors()),   
            ...this.adventureModalitiesComponent.toArray().flatMap((c) => c.getFormErrors()),   
        ];

        if (errors.length > 0) {
            //this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    get procedureField(): AbstractControl {
        return this.mainForm.controls['procedure'];
    }

    get establishmentField(): AbstractControl {
        return this.mainForm.controls['establishment'];
    }

    get locationField(): AbstractControl {
        return this.mainForm.controls['location'];
    }

    get contactPersonField(): AbstractControl {
        return this.mainForm.controls['contactPerson'];
    }

    get establishmentStaffField(): AbstractControl {
        return this.mainForm.controls['establishmentStaff'];
    }   

    get establishmentCapacityField(): AbstractControl {
        return this.mainForm.controls['establishmentCapacity'];
    }  

    get establishmentServicesField(): AbstractControl {
        return this.mainForm.controls['establishmentServices'];
    }   

    get adventureModalitiesField(): AbstractControl {
        return this.mainForm.controls['adventureModalities'];
    }   
}

