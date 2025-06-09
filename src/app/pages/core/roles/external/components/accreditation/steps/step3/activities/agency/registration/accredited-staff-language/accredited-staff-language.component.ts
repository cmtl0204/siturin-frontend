import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProgramInterface } from '@modules/core/interfaces';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { AuthService } from '@modules/auth/auth.service';
import { BreadcrumbService } from '@layout/service';
import { MY_ROUTES } from '@routes';
import { Router } from '@angular/router';
import { AccreditationHttpService } from '@modules/core/roles/external/services';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    selector: 'app-accredited-staff-language',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch, InputNumber],
    templateUrl: './accredited-staff-language.component.html',
    styleUrl: './accredited-staff-language.component.scss'
})
export class AccreditedStaffLanguageComponent implements OnInit {
    @Input() id!: string | undefined;
    @Output() dataOut = new EventEmitter();
    private readonly _formBuilder = inject(FormBuilder);
    protected readonly _router = inject(Router);
    private readonly _breadcrumbService = inject(BreadcrumbService);
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly Validators = Validators;
    protected readonly _authService = inject(AuthService);
    protected readonly _customMessageService = inject(CustomMessageService);
    private readonly _programHttpService = inject(AccreditationHttpService);
    protected form!: FormGroup;
    protected programs: ProgramInterface[] = [];

    constructor() {
        this._breadcrumbService.setItems([
            {
                label: 'Proyectos',
                routerLink: [MY_ROUTES.corePages.external.accreditation.absolute]
            },
            { label: 'Formulario' }
        ]);

        this.buildForm();

        this.form.valueChanges.subscribe((value) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
    }

    ngOnInit() {
        this.find();
    }

    buildForm() {
        this.form = this._formBuilder.group({
            totalAccreditedStaffLanguage: [null, [Validators.required]],
            percentageAccreditedStaffLanguage: [null, [Validators.required]]
        });
    }

    find() {}

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.totalAccreditedStaffLanguageField.invalid) errors.push('¿Cuántas personas están acreditadas como mínimo el nivel B1 de conocimiento de al menos un idioma extranjero de acuerdo al Marco Común Europeo para las Lenguas?');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    markAllAsTouched(){
        this.form.markAllAsTouched();
    }

    createProject() {}

    updateProject() {}

    get totalAccreditedStaffLanguageField(): AbstractControl {
        return this.form.controls['totalAccreditedStaffLanguage'];
    }

    get percentageAccreditedStaffLanguageField(): AbstractControl {
        return this.form.controls['percentageAccreditedStaffLanguage'];
    }
}
