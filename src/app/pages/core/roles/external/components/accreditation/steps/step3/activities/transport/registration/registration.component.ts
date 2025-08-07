import { Component, inject, Input, QueryList, ViewChildren, OnChanges, SimpleChanges } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomMessageService } from '@utils/services';
import { CommonModule } from '@angular/common';
import { CatalogueInterface } from '@utils/interfaces';
import { Subscription } from 'rxjs';
import { AirComponent } from '../shared/air/air.component';
import { AprotectecComponent } from '../shared/aprotectec/aprotectec.component'; 
import { LandComponent } from '../shared/land/land.component';
import { MaritimeComponent } from '../shared/maritime/maritime.component';
import { Step3Component } from '../../../step3.component';
import { VehicleTypeComponent } from "../shared/type-vehicles/type-vehicles.component";

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [CommonModule, Button, AirComponent, MaritimeComponent, LandComponent, AprotectecComponent], 
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnChanges {
    protected readonly PrimeIcons = PrimeIcons;

    @Input() classification: any; 

    @ViewChildren(AirComponent) private airComponent!: QueryList<AirComponent>;
    @ViewChildren(AprotectecComponent) private aprotectedComponent!: QueryList<AprotectecComponent>;
    @ViewChildren(LandComponent) private landComponent!: QueryList<LandComponent>;
    @ViewChildren(MaritimeComponent) private maritimeComponent!: QueryList<MaritimeComponent>;

    private formBuilder = inject(FormBuilder);
    protected mainForm!: FormGroup;
    protected showTypeEstablishment = false;
    protected readonly customMessageService = inject(CustomMessageService);

    constructor() {
        this.mainForm = this.formBuilder.group({
            aprotected: [{ value: null, disabled: true }], 
            air : [{ value: null, disabled: true }],
            land: [{ value: null, disabled: true }],
            maritime: [{ value: null, disabled: true }],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['classification'] && this.classification) {
        // Deshabilitamos todos los controles del mainForm al cambiar la clasificación
        this.mainForm.get('air')?.disable();
        this.mainForm.get('land')?.disable();
        this.mainForm.get('maritime')?.disable();
        this.mainForm.get('aprotected')?.disable(); 

        switch (this.classification.name) {
          case 'Aereo':
            this.mainForm.get('air')?.enable();
            break;
          case 'Terrestre':
            this.mainForm.get('land')?.enable();
            break;
          case 'Maritimo':
            this.mainForm.get('maritime')?.enable();
            break;
        }
      }
    }


    saveForm(childForm: FormGroup) {
        if (childForm.contains('landUse')) {
            this.showTypeEstablishment = childForm.get('landUse')?.value === true;
        }
        Object.keys(childForm.controls).forEach(controlName => {
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
        const errors: string[] = [];

        if (this.mainForm.get('air')?.enabled && this.airComponent) {
            errors.push(...this.airComponent.toArray().flatMap((c) => c.getFormErrors()));
        }
        if (this.mainForm.get('aprotected')?.enabled && this.aprotectedComponent) {
            errors.push(...this.aprotectedComponent.toArray().flatMap((c) => c.getFormErrors()));
        }
        if (this.mainForm.get('land')?.enabled && this.landComponent) {
            errors.push(...this.landComponent.toArray().flatMap((c) => c.getFormErrors()));
        }
        if (this.mainForm.get('maritime')?.enabled && this.maritimeComponent) {
            errors.push(...this.maritimeComponent.toArray().flatMap((c) => c.getFormErrors()));
        }

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return true;
        }

        return false; 
    }

    get airField(): AbstractControl{
        return this.mainForm.controls['air'];
    }

    get aprotectedField(): AbstractControl{
        return this.mainForm.controls['aprotected'];
    }

    get landField(): AbstractControl{
        return this.mainForm.controls['land'];
    }

    get maritimeField(): AbstractControl{
        return this.mainForm.controls['maritime'];
    }
}
