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

    protected airlineTypes: CatalogueInterface[] = [
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
            airlineType: [null, Validators.required],
            localType: [null, Validators.required],
            certifiedCode: [null, Validators.required],
            certified: [false, Validators.required],
            certifiedIssueAt: [null, Validators.required],
            certifiedExpirationAt: [null, Validators.required]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.airlineTypeField.valueChanges.subscribe((value: boolean) => {
            if (value) {
                this.localTypeField.setValidators([Validators.required]);
            } else {
                this.localTypeField.clearValidators();
                this.localTypeField.setValue(false);
            }
            this.localTypeField.updateValueAndValidity();
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }

        if (this.airlineTypeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    loadData() {}

    get airlineTypeField(): AbstractControl {
        return this.form.controls['airlineType'];
    }

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get certifiedCodeField(): AbstractControl {
        return this.form.controls['certifiedCode'];
    }

    get certifiedField(): AbstractControl {
        return this.form.controls['certified'];
    }

    get certifiedIssueAtField(): AbstractControl {
        return this.form.controls['certifiedIssueAt'];
    }

    get certifiedExpirationAtField(): AbstractControl {
        return this.form.controls['certifiedExpirationAt'];
    }

    protected readonly Validators = Validators;
}
