import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { InputNumber } from 'primeng/inputnumber';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-accredited-staff-language',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, InputNumber],
    templateUrl: './accredited-staff-language.component.html',
    styleUrl: './accredited-staff-language.component.scss'
})
export class AccreditedStaffLanguageComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    private readonly _formBuilder = inject(FormBuilder);
    protected readonly _customMessageService = inject(CustomMessageService);
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    buildForm() {
        this.form = this._formBuilder.group({
            totalAccreditedStaffLanguage: [null, [Validators.required]],
            percentageAccreditedStaffLanguage: [null, [Validators.required]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.totalAccreditedStaffLanguageField.invalid) errors.push('¿Cuántas personas están acreditadas como mínimo el nivel B1 de conocimiento de al menos un idioma extranjero de acuerdo al Marco Común Europeo para las Lenguas?');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get totalAccreditedStaffLanguageField(): AbstractControl {
        return this.form.controls['totalAccreditedStaffLanguage'];
    }

    get percentageAccreditedStaffLanguageField(): AbstractControl {
        return this.form.controls['percentageAccreditedStaffLanguage'];
    }
}
