import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { TouristGuideComponent } from '@/pages/core/shared';

@Component({
    selector: 'app-community-operation',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToggleSwitch,
        MultiSelectModule,
        CardModule,
        PanelModule,
        MessageModule,
        InputTextModule,
        DialogModule,
        TableModule,
        ButtonModule,
        Fluid,
        TouristGuideComponent
    ],
    templateUrl: './community-operation.component.html',
    styleUrl: './community-operation.component.scss'
})
export class CommunityOperationComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    @ViewChild(TouristGuideComponent) private touristGuideComponent!: TouristGuideComponent;

    protected form!: FormGroup;
    protected formGuia!: FormGroup;

    protected showGuide = false;
    protected showDialog = false;
    protected showModalities = false;

    protected guides: { id: string; name: string }[] = [];

    protected optionsModalities = {
        water: [
            { label: 'Modalidades recreativas en embarcaciones motorizadas (boya, banana, parasailing y esquí acuático)', value: 'embarcaciones' },
            { label: 'Buceo', value: 'buceo' },
            { label: 'Kayak de mar', value: 'kayak_mar' },
            { label: 'Kayak de lacustre', value: 'kayak_lacustre' },
            { label: 'Kayak de río', value: 'kayak_rio' },
            { label: 'Kite surf', value: 'kite_surf' },
            { label: 'Rafting', value: 'rafting' },
            { label: 'Snorkel', value: 'snorkel' },
            { label: 'Surf', value: 'surf' },
            { label: 'Tubing', value: 'tubing' }
        ],
        air: [
            { label: 'Alas Delta', value: 'alas_delta' },
            { label: 'Parapente', value: 'parapente' }
        ],
        land: [
            { label: 'Cabalgata', value: 'cabalgata' },
            { label: 'Canyoning', value: 'canyoning' },
            { label: 'Cicloturismo', value: 'cicloturismo' },
            { label: 'Escalada', value: 'escalada' },
            { label: 'Exploracion de cuevas', value: 'exploracion_cuevas' },
            { label: 'Montañismo', value: 'montañismo' },
            { label: 'Senderismo', value: 'senderismo' },
            { label: 'Salto del Puente', value: 'salto_del_puente' },
            { label: 'Canopy', value: 'canopy' },
            { label: 'Tarabita', value: 'tarabita' }
        ]
    };

    constructor() {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadData();
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            hasModalities: [false],
            hasGuide: [false],
            water: [[]],
            air: [[]],
            land: [[]],
            touristGuides: [[]]
        });

        this.formGuia = this.formBuilder.group({
            id: ['', Validators.required]
        });

        this.form.get('hasModalities')?.valueChanges.subscribe((val) => {
            this.showModalities = val;
        });

        this.watchFormChanges();
    }

    watchFormChanges(): void {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            console.log(this.form.value);
            if (this.form.valid) {
                this.dataOut.emit(this.form.value);
            }
        });
    }

    saveForm(childForm: FormGroup): void {
        const touristGuides = childForm.get('touristGuides')?.value || [];

        this.form.patchValue({
            touristGuides,
            hasGuide: touristGuides.length > 0
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        // Validación: al menos uno de los dos switches activados
        const hasModalities = this.hasModalitiesField.value;
        // const hasGuide = this.touristGuideComponent?.hasTouristGuideControl?.value;
        const hasGuide = false;

        if (!hasModalities && !hasGuide) {
            errors.push('Debe seleccionar al menos una de las siguientes opciones: Modalidades de Turismo Aventura o Guías de Turismo.');
        }

        // Validación: si tieneModalidades = true, al menos un multiselect debe tener valores
        if (hasModalities) {
            const water = this.waterField.value || [];
            const air = this.airField.value || [];
            const land = this.landField.value || [];

            if (water.length === 0 && air.length === 0 && land.length === 0) {
                errors.push('Debe seleccionar al menos una modalidad de turismo de aventura (agua, aire o tierra).');
            }
        }

        // Validación: si tieneGuia = true, debe haber al menos un guía registrado
        if (hasGuide) {
            const guiaErrors = this.touristGuideComponent.getFormErrors();
            errors.push(...guiaErrors);
        }

        // Si hay errores, marcar todo como touched
        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    addGuia(): void {
        if (this.formGuia.valid) {
            const id = this.formGuia.value.id;
            const newGuide = { id, name: 'Dilan' };
            this.guides.push(newGuide);

            // Actualizar el campo hasGuide y touristGuides del formulario
            this.form.patchValue({
                hasGuide: true,
                touristGuides: this.guides
            });

            this.formGuia.reset();
            this.showDialog = false;
        }
    }

    loadData(): void {}

    // Getters
    get hasModalitiesField(): AbstractControl {
        return this.form.controls['hasModalities'];
    }

    get waterField(): AbstractControl {
        return this.form.controls['water'];
    }

    get airField(): AbstractControl {
        return this.form.controls['air'];
    }

    get landField(): AbstractControl {
        return this.form.controls['land'];
    }

    get touristGuidesField(): AbstractControl {
        return this.form.controls['touristGuides'];
    }
}
