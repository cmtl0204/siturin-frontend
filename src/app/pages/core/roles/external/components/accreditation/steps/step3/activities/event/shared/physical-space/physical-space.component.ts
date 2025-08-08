import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';

@Component({
    selector: 'app-physical-space',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch],
    templateUrl: './physical-space.component.html',
    styleUrl: './physical-space.component.scss'
})
export class PhysicalSpaceComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    private readonly catalogueService = inject(CatalogueService);

    protected form!: FormGroup;

    protected localTypes: CatalogueInterface[] = [];

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadCatalogues();
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            localType: [null, [Validators.required]],
            isProtectedArea: [false, [Validators.required]],
            hasProtectedAreaContract: [false]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.isProtectedAreaField.valueChanges.subscribe((value) => {
            this.hasProtectedAreaContractField.clearValidators();
            this.hasProtectedAreaContractField.reset();

            if (value) {
                this.hasProtectedAreaContractField.setValidators(Validators.required);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) errors.push('Su local es');

        if (this.isProtectedAreaField.invalid)
            errors.push(
                '¿Realiza actividades autorizadas por la Autoridad Ambiental Nacional en el Subsistema Estatal del Sistema de Áreas Naturales Protegidas, de conformidad con lo establecido en los artículos 8 y 9 de la Ley de Turismo dentro del Subsistema Estatal del Sistema Nacional de Áreas Protegidas?'
            );

        if (this.hasProtectedAreaContractField.invalid) errors.push('Al momento de la inspección se presentará la licencia única de funcionamiento');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    async loadCatalogues() {
        this.localTypes = await this.catalogueService.findByType(CatalogueTypeEnum.activities_geographic_area);
    }

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get isProtectedAreaField(): AbstractControl {
        return this.form.controls['isProtectedArea'];
    }

    get hasProtectedAreaContractField(): AbstractControl {
        return this.form.controls['hasProtectedAreaContract'];
    }
}
