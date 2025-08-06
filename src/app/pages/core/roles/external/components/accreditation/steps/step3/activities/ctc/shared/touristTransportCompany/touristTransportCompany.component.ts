import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { debounceTime } from 'rxjs';
import { Select } from 'primeng/select';
import { CatalogueInterface } from '@modules/auth/interfaces';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueTypeEnum } from '@utils/enums/catalogue.enum';

@Component({
    selector: 'app-touristTransportCompany',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CardModule, PanelModule, MessageModule, ToggleSwitch, ButtonModule, DialogModule, InputTextModule, TableModule, FormsModule, Select],
    templateUrl: './touristTransportCompany.component.html',
    styleUrl: './touristTransportCompany.component.scss'
})
export class TouristTransportCompanyComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    private readonly catalogueService = inject(CatalogueService);
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected transportForm!: FormGroup;

    protected types: CatalogueInterface[] = [];

    protected transportDialog = false;

    // Array para transportes agregados
    protected transports: any[] = [];

    // Datos SRI
    protected sriData = {
        state: 'ACTIVO',
        socialReason: 'Compañía Transporte',
        rucType: 'PLN',
        actividadEconomica: 'OTRAS ACTIVIDADES PROFESIONALES, CIENTÍFICAS Y TÉCNICAS NCP'
    };

    constructor() {
        this.buildForm();
        this.buildTransportForm();
    }

    ngOnInit(): void {
        this.loadData();
        this.loadCatalogues();
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            hasTransports: [false, Validators.required],
            transports: [[], Validators.required]
        });

        this.hasTransportsField.valueChanges.subscribe((has) => {
            const transportsControl = this.form.get('transports');
            if (has) {
                transportsControl?.setValidators(Validators.required);
            } else {
                transportsControl?.clearValidators();
                this.transports = [];
                transportsControl?.setValue([]);
            }
            transportsControl?.updateValueAndValidity();
        });

        this.form.valueChanges.pipe(debounceTime(200)).subscribe(() => {
            this.dataOut.emit(this.form.getRawValue());
        });
    }

    buildTransportForm(): void {
        this.transportForm = this.formBuilder.group({
            types: [null, Validators.required],
            ruc: [null, Validators.required],
            authorizationNumber: ['']
        });

        this.transportForm.get('types')?.valueChanges.subscribe((types) => {
            const authCtrl = this.transportForm.get('authorizationNumber');
            if (types?.name === 'Aéreo') {
                authCtrl?.setValidators([Validators.required]);
            } else {
                authCtrl?.clearValidators();
            }
            authCtrl?.updateValueAndValidity();
        });
    }

    openDialog(): void {
        this.transportForm.reset();
        this.transportDialog = true;
    }

    closeDialog(): void {
        this.transportDialog = false;
    }

    addTransport(): void {
        if (this.transportForm.invalid) {
            this.transportForm.markAllAsTouched();
            this.customMessageService.showFormErrors(this.getFormErrors());
            return;
        }

        const { types, ruc, authorizationNumber } = this.transportForm.value;
        const newTransport = {
            types: types.name,
            ruc,
            authorizationNumber,
            socialReason: this.sriData.socialReason,
            rucType: this.sriData.rucType
        };

        this.transports.push(newTransport);
        this.transportsField.setValue(this.transports);
        this.dataOut.emit(this.form.getRawValue());
        this.closeDialog();
    }

    removeTransport(index: number): void {
        this.transports.splice(index, 1);
        this.transportsField.setValue(this.transports);
    }

    watchFormChanges(): void {
        this.transportForm.valueChanges.subscribe(() => {
            if (this.transportForm.valid) {
                this.dataOut.emit(this.transportForm.value);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];
        const controls = this.transportForm.controls;
        for (const key in controls) {
            if (controls[key].invalid) {
                errors.push(`Campo ${key} es obligatorio o inválido`);
            }
        }
        if (this.hasTransportsField.value && this.transports.length === 0) {
            errors.push('Debe agregar al menos una compañía de transporte.');
        }
        return errors;
    }

    loadData(): void {
        // Puedes cargar datos iniciales si tienes
    }

    async loadCatalogues() {
        this.types = await this.catalogueService.findByType(CatalogueTypeEnum.tourist_transport_companies_type);
        console.log(this.types);
    }

    // Getters para los campos
    get hasTransportsField(): FormControl {
        return this.form.get('hasTransports') as FormControl;
    }

    get transportsField(): FormControl {
        return this.form.get('transports') as FormControl;
    }

    get rucField(): FormControl {
        return this.transportForm.get('ruc') as FormControl;
    }

    get typesField(): FormControl {
        return this.transportForm.get('types') as FormControl;
    }

    get authorizationNumberField(): FormControl {
        return this.transportForm.get('authorizationNumber') as FormControl;
    }
}
