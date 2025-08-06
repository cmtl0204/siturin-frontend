import { CommonModule } from '@angular/common';
import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { Status1Component } from './status1/status1.component';
import { Status2Component } from './status2/status2.component';
import { Status3Component } from './status3/status3.component';
import { Status4Component } from './status4/status4.component';
import { Status5Component } from './status5/status5.component';
import { InspectionStatusService } from '../../services/inspection-status.service';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueInterface } from '@utils/interfaces';
import { PrimeIcons } from 'primeng/api';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [Dialog, ButtonModule, Select, FormsModule, ReactiveFormsModule, LabelDirective, CommonModule, Status1Component, Status2Component, Status3Component, Status4Component, Status5Component, Fluid],
    templateUrl: './results.component.html',
    styleUrl: './results.component.scss'
})
export class ResultsComponent {
    @ViewChildren(Status1Component) private status1Component!: QueryList<Status1Component>;
    @ViewChildren(Status2Component) private status2Component!: QueryList<Status2Component>;
    @ViewChildren(Status3Component) private status3Component!: QueryList<Status3Component>;
    @ViewChildren(Status4Component) private status4Component!: QueryList<Status4Component>;
    @ViewChildren(Status5Component) private status5Component!: QueryList<Status5Component>;

    protected status = [
        { id: '2151c6f4-524e-4d69-b2ec-37231c4a7c3e', code: 'RATIFICADO' },
        { id: '8eb7454b-6c18-4789-ab50-b70d81fc49cc', code: 'INACTIVO' },
        { id: '9bd45ae2-3c07-43fb-82cd-b04ef738fad0', code: 'SUSPENSION TEMPORAL' },
        { id: 'f71a3fc6-3749-4a63-8608-5499e4b9ee4f', code: 'RECATEGORIZADO POR OFICIO' },
        { id: '879a2ff3-1f6b-4e86-8a4d-853f4de7240a', code: 'RECLASIFICADO POR OFICIO' }
    ];

    private readonly catalogueService = inject(CatalogueService);
    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;
    protected types: CatalogueInterface[] = [];

    visible: boolean = false;

    constructor(private inspectionStatusService: InspectionStatusService) {
        this.buildForm();
    }

    async ngOnInit(): Promise<void> {
        await this.loadCatalogues();
    }

    async loadCatalogues() {
        try {
            this.types = await this.catalogueService.findByType(CatalogueTypeEnum.cadastre_states_state);
            console.log('Tipos cargados:', this.types);
        } catch (error) {
            console.error('Error al cargar tipos:', error);
        }
    }

    showDialog() {
        this.visible = true;
    }

    buildForm() {
        this.form = this.formBuilder.group({
            cadastreId: ['4d4b2582-bc68-4fa7-8596-25099fd8946a'],
            processId: ['f6783e73-adca-4290-8cc6-c9d9376f7355'],
            state: [null, [Validators.required]],

            status1: this.formBuilder.group({}),
            status2: this.formBuilder.group({
                inactivationCauses: [null, Validators.required]
            }),
            status3: this.formBuilder.group({
                breachCauses: [null, Validators.required]
            }),
            status4: this.formBuilder.group({
                category: [null, Validators.required]
            }),
            status5: this.formBuilder.group({
                classification: [null, Validators.required],
                category: [null, Validators.required]
            })
        });
    }

    sendForm() {
        const cadastreId = this.cadastreIdField.value;
        const processId = this.processIdField.value;
        const state = this.stateField.value;
        const statusId = state?.id;

        switch (statusId) {
            case '2151c6f4-524e-4d69-b2ec-37231c4a7c3e': // RATIFICADO
                this.createRegistrationInspectionStatus();
                break;

            case '8eb7454b-6c18-4789-ab50-b70d81fc49cc': // INACTIVO
                this.createInactivationInspectionStatus();
                break;

            case '9bd45ae2-3c07-43fb-82cd-b04ef738fad0': // SUSPENSION TEMPORAL
                this.createTemporarySuspensionInspectionStatus();
                break;

            case 'f71a3fc6-3749-4a63-8608-5499e4b9ee4f': // RECATEGORIZADO
                this.createRecategorizedInspectionStatus();
                break;

            case '879a2ff3-1f6b-4e86-8a4d-853f4de7240a': // RECLASIFICADO
                this.createReclassifiedInspectionStatus();
                break;

            default:
                console.warn('Estado no reconocido');
        }
    }

    private getCleanState(): { id: string; code: string } {
        const state = this.stateField.value;
        return {
            id: state.id,
            code: state.code
        };
    }

    createRegistrationInspectionStatus() {
        const controls = [this.cadastreIdField, this.processIdField, this.stateField];

        if (!this.areControlsValid(controls)) {
            console.warn('Campos base inválidos');
            return;
        }

        const payload = {
            cadastreId: this.cadastreIdField.value,
            processId: this.processIdField.value,
            state: this.getCleanState()
        };

        console.log(payload);

        this.inspectionStatusService.createRegistrationInspectionStatus(payload).subscribe({
            next: (res) => {
                console.log('Ratificado creado:', res);
                this.visible = false;
                console.log(payload);
            },
            error: (err) => {
                console.error('Error al crear Ratificado:', err);
            }
        });
    }

    createInactivationInspectionStatus() {
        const controls = [this.cadastreIdField, this.processIdField, this.stateField, this.status2Form.get('inactivationCauses')!];

        if (!this.areControlsValid(controls)) {
            console.warn('Campos inválidos para Inactivo');
            return;
        }

        const payload = {
            cadastreId: this.cadastreIdField.value,
            processId: this.processIdField.value,
            state: this.getCleanState(),
            inactivationCauses: this.status2Form.get('inactivationCauses')?.value
        };

        console.log(payload);

        this.inspectionStatusService.createInactivationInspectionStatus(payload).subscribe({
            next: (res) => {
                console.log('Inactivo creado:', res);
                this.visible = false;
            },
            error: (err) => {
                console.error('Error al crear Inactivo:', err);
            }
        });
    }

    createTemporarySuspensionInspectionStatus() {
        const controls = [this.cadastreIdField, this.processIdField, this.stateField, this.status3Form.get('breachCauses')!];

        if (!this.areControlsValid(controls)) {
            console.warn('Campos inválidos para Suspensión Temporal');
            return;
        }

        const payload = {
            cadastreId: this.cadastreIdField.value,
            processId: this.processIdField.value,
            state: this.getCleanState(),
            breachCauses: this.status3Form.get('breachCauses')?.value
        };

        console.log(payload);

        this.inspectionStatusService.createTemporarySuspensionInspectionStatus(payload).subscribe({
            next: (res) => {
                console.log('Suspensión creada:', res);
                this.visible = false;
            },
            error: (err) => {
                console.error('Error al crear Suspensión:', err);
            }
        });
    }

    createRecategorizedInspectionStatus() {
        const controls = [this.cadastreIdField, this.processIdField, this.stateField, this.status4Form.get('category')!];

        if (!this.areControlsValid(controls)) {
            console.warn('Campos inválidos para Recategorizado');
            return;
        }

        const payload = {
            cadastreId: this.cadastreIdField.value,
            processId: this.processIdField.value,
            state: this.getCleanState(),
            category: this.status4Form.get('category')?.value
        };

        console.log(payload);

        this.inspectionStatusService.createRecategorizedInspectionStatus(payload).subscribe({
            next: (res) => {
                console.log('Recategorizado creado:', res);
                this.visible = false;
            },
            error: (err) => {
                console.error('Error al crear Recategorizado:', err);
            }
        });
    }

    createReclassifiedInspectionStatus() {
        const controls = [this.cadastreIdField, this.processIdField, this.stateField, this.status5Form.get('classification')!, this.status5Form.get('category')!];

        if (!this.areControlsValid(controls)) {
            console.warn('Campos inválidos para Reclasificado');
            return;
        }

        const payload = {
            cadastreId: this.cadastreIdField.value,
            processId: this.processIdField.value,
            state: this.getCleanState(),
            classification: this.status5Form.get('classification')?.value,
            category: this.status5Form.get('category')?.value
        };

        console.log(payload);

        this.inspectionStatusService.createReclassifiedInspectionStatus(payload).subscribe({
            next: (res) => {
                console.log('Reclasificado creado:', res);
                this.visible = false;
            },
            error: (err) => {
                console.error('Error al crear Reclasificado:', err);
            }
        });
    }

    // Método de validación reutilizable
    private areControlsValid(controls: AbstractControl[]): boolean {
        controls.forEach((control) => control.markAsTouched());
        return controls.every((control) => control.valid);
    }

    // Getters
    get cadastreIdField(): AbstractControl {
        return this.form.controls['cadastreId'];
    }

    get processIdField(): AbstractControl {
        return this.form.controls['processId'];
    }

    get stateField(): AbstractControl {
        return this.form.controls['state'];
    }

    get status1Form(): FormGroup {
        return this.form.get('status1') as FormGroup;
    }

    get status2Form(): FormGroup {
        return this.form.get('status2') as FormGroup;
    }

    get status3Form(): FormGroup {
        return this.form.get('status3') as FormGroup;
    }

    get status4Form(): FormGroup {
        return this.form.get('status4') as FormGroup;
    }

    get status5Form(): FormGroup {
        return this.form.get('status5') as FormGroup;
    }

    protected readonly PrimeIcons = PrimeIcons;
}
