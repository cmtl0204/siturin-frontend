import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { Message } from 'primeng/message';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { AprotectecComponent } from '../aprotectec/aprotectec.component';

interface CatalogueInterface {
    name: string;
    code: string;
}

@Component({
    selector: 'app-air',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, SelectModule, Message, LabelDirective, ErrorMessageDirective, ToggleSwitchModule, InputTextModule, DatePickerModule],
    templateUrl: './air.component.html',
    styleUrl: './air.component.scss'
})
export class AirComponent implements OnInit {
    protected readonly formBuilder = inject(FormBuilder);
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected form!: FormGroup;

    protected localTypes: CatalogueInterface[] = [
        { name: 'Islas de Centros Comerciales', code: 'islas' },
        { name: 'Local Comercial', code: 'comercial' },
        { name: 'Oficinas', code: 'oficinas' },
        { name: 'Oficinas Compartidas', code: 'compartidas' }
    ];

    protected aerolineTypes: CatalogueInterface[] = [
        { name: 'Internacional', code: 'internacional' },
        { name: 'Nacional', code: 'nacional' }
    ];

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            aerolineType: [null, Validators.required],
            localType: [null, Validators.required],
            isEnrollment: [null, Validators.required],
            code: [null, Validators.required],
            issueAt: [null, Validators.required],
            expirationAt: [null, Validators.required]
        });
    }

    watchFormChanges() {
        this.aerolineTypeField.valueChanges.subscribe((value: boolean) => {
            if (value) {
                this.localTypeField.setValidators([Validators.required]);
            } else {
                this.localTypeField.clearValidators();
                this.localTypeField.setValue(false);
            }
            this.localTypeField.updateValueAndValidity();
        });

        this.localTypeField.valueChanges.subscribe((value: boolean) => {
            if (value) {
                this.isEnrollmentField.setValidators([Validators.required]);
            } else {
                this.isEnrollmentField.clearValidators();
                this.isEnrollmentField.setValue(false);
            }
            this.isEnrollmentField.updateValueAndValidity();
        });

        this.form.valueChanges.subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    loadData() {}

    get aerolineTypeField(): AbstractControl {
        return this.form.controls['aerolineType'];
    }

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get isEnrollmentField(): AbstractControl {
        return this.form.controls['isEnrollment'];
    }

    get codeField(): AbstractControl {
        return this.form.controls['code'];
    }

    get issueAtField(): AbstractControl {
        return this.form.controls['issueAt'];
    }

    get expirationAtField(): AbstractControl {
        return this.form.controls['expirationAt'];
    }
}
