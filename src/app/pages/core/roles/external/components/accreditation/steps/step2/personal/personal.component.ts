import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    selector: 'app-physical-space',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch, InputNumber],
    templateUrl: './personal.component.html',
    styleUrl: './personal.component.scss'
})
export class PersonalComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            totalMen: [null],
            totalWomen: [null],
            totalMenDisability: [false],
            totalWomenDisability: [false]
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

        if (this.totalMenField.invalid) errors.push('Total de hombres, que trabajan en el establecimiento');

        if (this.totalWomenField.invalid) errors.push('Espacio físico Permanente');

        if (this.totalMenDisabilityField.invalid)
            errors.push(
                '¿Realiza actividades autorizadas por la Autoridad Ambiental Nacional en el Subsistema Estatal del Sistema de Áreas Naturales Protegidas, de conformidad con lo establecido en los artículos 8 y 9 de la Ley de Turismo dentro del Subsistema Estatal del Sistema Nacional de Áreas Protegidas?'
            );

        if (this.totalWomenDisabilityField.invalid) errors.push('Al momento de la inspección se presentará la licencia única de funcionamiento');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get totalMenField(): AbstractControl {
        return this.form.controls['totalMen'];
    }

    get totalWomenField(): AbstractControl {
        return this.form.controls['totalWomen'];
    }

    get totalMenDisabilityField(): AbstractControl {
        return this.form.controls['totalMenDisability'];
    }

    get totalWomenDisabilityField(): AbstractControl {
        return this.form.controls['totalWomenDisability'];
    }
}
