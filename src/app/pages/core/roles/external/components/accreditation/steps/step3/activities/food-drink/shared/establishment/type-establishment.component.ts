import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { InputText } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-type-establishment',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch, InputText, CommonModule],
    templateUrl: './type-establishment.component.html',
    styleUrl: './type-establishment.component.scss'
})
export class TypeEstablishmentComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;

    protected typeEstablishments: CatalogueInterface[] = [
        { name: 'Cadena', id: '1' },
        { name: 'Franquicia', id: '2' },
        { name: 'Ninguno', id: '3' }
    ];

    protected serviceTypes: CatalogueInterface[] = [
        { name: 'Autoservicio', id: '1' },
        { name: 'Bufet', id: '2' },
        { name: 'Menú', id: '3' },
        { name: 'Menú fijo', id: '4' },
        { name: 'Servicio a Domicilio', id: '5' },
        { name: 'Servicio al auto', id: '6' }
    ];

    protected kitchenTypes: CatalogueInterface[] = [
        { name: 'Africana', id: '1' },
        { name: 'Alemana', id: '2' },
        { name: 'Americana', id: '3' },
        { name: 'Argentina', id: '4' },
        { name: 'Asiática', id: '5' },
        { name: 'Australiana', id: '6' },
        { name: 'Brasilera', id: '7' },
        { name: 'Chilena', id: '8' },
        { name: 'China', id: '9' },
        { name: 'Cocina Andina', id: '10' },
        { name: 'Cocina Patrimonial', id: '11' },
        { name: 'Colombiana', id: '12' },
        { name: 'Coreana', id: '13' },
        { name: 'Costa Rica', id: '14' },
        { name: 'Cubana', id: '15' },
        { name: 'Dominicana', id: '16' },
        { name: 'Ecuatoriana', id: '17' },
        { name: 'Escandinava', id: '18' },
        { name: 'Española', id: '19' }
    ];

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    onSubmit() {
        console.log(this.form.value);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            typeEstablishment: [null, [Validators.required]], //establishmentTypeId
            establishmentName: [null, [Validators.required]],
            franchiseCertificate: [null, [Validators.required]] //hasFranchiseGrantCertificate
            // tables: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
            // capacity: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
            // serviceTypes: [[], [Validators.required]],
            // kitchenTypes: [[], [Validators.required]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.typeEstablishmentField.valueChanges.subscribe((value) => {
            // if (value.id === CatalogueProcessFoodDrinksEstablishmentTypeEnum.cadena) {
            if (value.id === '2') {
                this.franchiseCertificateField.setValidators([Validators.required]);
            }

            if (value.id === '1') {
                this.franchiseCertificateField.clearValidators();
            }

            if (value.id === '3') {
                this.franchiseCertificateField.setValidators([Validators.required]);
                this.franchiseCertificateField.clearValidators();
            }

            this.franchiseCertificateField.updateValueAndValidity();
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.typeEstablishmentField.invalid) errors.push('Tipo de Establecimiento');
        if (this.establishmentNameField.invalid) errors.push('Nombre de la Franquicia o Cadena');
        if (this.franchiseCertificateField.invalid) errors.push('Certificación de concesión de la franquicia');
        if (this.tablesField.invalid) errors.push('Número de mesas');
        if (this.capacityField.invalid) errors.push('Capacidad en número de personas');
        if (this.serviceTypesField.invalid) errors.push('Tipo de Servicio');
        if (this.kitchenTypesField.invalid) errors.push('Tipo de Cocina');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get typeEstablishmentField(): AbstractControl {
        return this.form.controls['typeEstablishment'];
    }

    get establishmentNameField(): AbstractControl {
        return this.form.controls['establishmentName'];
    }

    // get typeEstablishmentField() {
    //     return this.form.get('typeEstablishment')!;
    // }

    // get establishmentNameField() {
    //     return this.form.get('establishmentName')!;
    // }
    get franchiseCertificateField(): AbstractControl {
        return this.form.controls['franchiseCertificate'];
    }

    get tablesField(): AbstractControl {
        return this.form.controls['tables'];
    }

    get capacityField(): AbstractControl {
        return this.form.controls['capacity'];
    }

    get serviceTypesField(): AbstractControl {
        return this.form.controls['serviceTypes'];
    }

    get kitchenTypesField(): AbstractControl {
        return this.form.controls['kitchenTypes'];
    }
}
