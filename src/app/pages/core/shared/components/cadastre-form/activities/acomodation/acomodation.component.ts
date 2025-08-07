import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { AccommodationVariablesComponent } from '../../independent-variables/accommodation/accommodation-variables.component';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { ProcedureComponent } from '../../sections/procedure/procedure.component';
import { EstablishmentComponent } from '../../sections/establishment/establishment.component';
import { LocationComponent } from '../../sections/location/location.component';
import { ContactPersonComponent } from '../../sections/contact-person/contact-person.component';
import { EstablishmentStaffComponent } from "../../sections/establishment-staff/establishment-staff.component";
import { CadastreComponent } from "../../sections/cadastre/cadastre.component";
import { AdventureModalitiesComponent } from "../../sections/adventure-modalities/adventure-modalities.component";

@Component({
    selector: 'app-acomodation',
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
    ProcedureComponent,
    EstablishmentComponent,
    AccommodationVariablesComponent,
    ButtonModule,
    LocationComponent,
    ContactPersonComponent,
    EstablishmentStaffComponent,
    CadastreComponent,
    AdventureModalitiesComponent
],
    templateUrl: './acomodation.component.html',
    styleUrl: './acomodation.component.scss'
})
export class AcomodationComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(ProcedureComponent) private procedureComponent!: QueryList<ProcedureComponent>;
    @ViewChildren(EstablishmentComponent) private establishmentComponent!: QueryList<EstablishmentComponent>;
    @ViewChildren(LocationComponent) private locationComponent!: QueryList<LocationComponent>;
    @ViewChildren(ContactPersonComponent) private contactPersonComponent!: QueryList<ContactPersonComponent>;
    @ViewChildren(EstablishmentStaffComponent) private establishmentStaffComponent!: QueryList<EstablishmentStaffComponent>;
    @ViewChildren(CadastreComponent) private cadastreComponent!: QueryList<CadastreComponent>;
    @ViewChildren(AccommodationVariablesComponent) private accommodationVariablesComponet!: QueryList<AccommodationVariablesComponent>;
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
            cadastre: [null],
            accommodationVariables: [null],
            adventureModalities: [null]
        });
    }

    saveForm(childForm: FormGroup, componentName: string) {
        /*  Object.keys(childForm.controls).forEach((controlName) => {
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

            case 'cadastre':
                this.cadastreField.patchValue(childForm.value);
                break;  
                
            case 'adventureModalities':
                this.adventureModalitiesField.patchValue(childForm.value);
                break;
        }
        console.log('Form1 updated:', this.mainForm.value);
        console.log('Form2 updated:', childForm.value);
        //console.log('Form3 updated:', childForm.value);
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
            ...this.cadastreComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.accommodationVariablesComponet.toArray().flatMap((c) => c.getFormErrors()),
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
    
    get cadastreField(): AbstractControl {
        return this.mainForm.controls['cadastre'];
    }
    
    get establishmentStaffField(): AbstractControl {
        return this.mainForm.controls['establishmentStaff'];
    } 

    get adventureModalitiesField(): AbstractControl {
        return this.mainForm.controls['adventureModalities'];
    } 

}
