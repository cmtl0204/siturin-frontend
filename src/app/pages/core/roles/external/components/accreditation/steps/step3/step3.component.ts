import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Select } from 'primeng/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { PrimeIcons } from 'primeng/api';
import { ParksComponent } from './activities/parks/parks.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueTypeEnum, CoreEnum } from '@utils/enums';
import { CoreSessionStorageService } from '@utils/services';

interface CatalogMode {
    code: 'registration' | 'update' | 'reclassification' | 'readmission' | string;
    name?: string;
}

@Component({
    selector: 'app-step3',
    standalone: true,
    imports: [Select, FormsModule, Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, NgIf, Button, ParksComponent],
    templateUrl: './step3.component.html',
    styleUrl: './step3.component.scss'
})
export class Step3Component implements OnInit {
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    private readonly formBuilder = inject(FormBuilder);
    private readonly catalogueService = inject(CatalogueService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected form!: FormGroup;
    protected currentActivity: string | null = null;

    protected showClassification: boolean = false;
    protected showCategory: boolean = false;

    protected readonly PrimeIcons = PrimeIcons;

    protected catalogMode: CatalogMode = { code: 'registration' };

    protected dpaZones: CatalogueInterface[] = [];

    protected activities = [
        { name: 'Alimentos y Bebidas', code: 'Alimentos y Bebidas' },
        { name: 'Parques de atracciones estables', code: 'Parques de atracciones estables' },
        { name: 'Alojamiento', code: 'Alojamiento' }
    ];

    protected classifications = [
        { name: 'Parques de atracciones estables', code: 'Parques de atracciones estables' },
        { name: 'Bolera', code: 'Bolera' },
        { name: 'Pista de patinaje', code: 'Pista de patinaje' },
        { name: 'Terma', code: 'Terma' },
        { name: 'Balneario', code: 'Balneario' },
        { name: 'Centro de recreación turística', code: 'Centro de recreación turística' }
    ];

    protected allCategories = [
        { name: 'Categoría Uno', code: 'Categoría Uno' },
        { name: 'Categoría Dos', code: 'Categoría Dos' },
        { name: 'Categoría Única', code: 'Categoría Única' }
    ];

    protected filteredCategories = [...this.allCategories];

    private enableAll(): void {
        this.activityField.enable();
        this.classificationField.enable();
        this.categoryField.enable();
    }

    private disableAll(): void {
        this.activityField.disable();
        this.classificationField.disable();
        this.categoryField.disable();
    }

    constructor(private cdr: ChangeDetectorRef) {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadCatalogues();
        this.watchFormChanges();

        this.catalogMode = { code: 'registration', name: 'Registrar' };

        this.setFormMode();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            zone: [{ value: null, disabled: true }, [Validators.required]],
            activityId: [null, [Validators.required]],
            classificationId: [null, [Validators.required]],
            categoryId: [null, [Validators.required]]
        });

        this.form.get('activityId')?.valueChanges.subscribe((activity) => {
            this.showClassification = activity?.name === 'Parques de atracciones estables';
            if (!this.showClassification) {
                this.form.get('classificationId')?.reset();
                this.form.get('categoryId')?.reset();
                this.showCategory = false;
            }
        });

        this.form.get('classificationId')?.valueChanges.subscribe((classification) => {
            const selected = classification?.name;
            this.showCategory = !!selected;
            if (!this.showCategory) {
                this.form.get('categoryId')?.reset();
                return;
            }

            if (selected === 'Terma' || selected === 'Balneario') {
                this.filteredCategories = this.allCategories.filter((c) => c.name === 'Categoría Uno' || c.name === 'Categoría Dos');
            } else {
                this.filteredCategories = this.allCategories.filter((c) => c.name === 'Categoría Única');
            }

            const currentValue = this.categoryField.value;
            const isStillValid = this.filteredCategories.some((c) => c.name === currentValue?.name);

            if (!isStillValid) {
                this.categoryField.reset();
            }
        });
    }

    setFormMode(): void {
        switch (this.catalogMode.code) {
            case 'update':
                this.disableAll();
                break;

            case 'registration':
                this.enableAll();
                break;

            case 'reclassification':
                this.enableAll();
                this.activityField.disable();
                break;

            case 'readmission':
                this.enableAll();
                break;
        }
        this.cdr.detectChanges();
    }

    async watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.activityField.valueChanges.subscribe(async (value) => {
            await this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, { activity: value });
        });
    }

    saveForm(mainForm: FormGroup) {
        Object.keys(mainForm.controls).forEach((controlName) => {
            const control = mainForm.get(controlName);
            if (control && !this.form.contains(controlName)) {
                this.form.addControl(controlName, control);
            } else {
                this.form.get(controlName)?.patchValue(control?.value);
            }
        });

        console.log(this.form.value);
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.zoneField.invalid) errors.push('Zona Geográfica es obligatoria.');
        if (this.activityField.invalid) errors.push('Actividad es obligatoria.');
        if (this.classificationField.invalid) errors.push('Clasificación es obligatoria.');
        if (this.categoryField.invalid) errors.push('Categoría es obligatoria.');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    onSubmit() {
        this.dataOut.emit(this.form);
    }

    loadCatalogues() {
        this.dpaZones = this.catalogueService.findByType(CatalogueTypeEnum.dpa_zone);
        console.log(this.dpaZones);
    }

    get zoneField(): AbstractControl {
        return this.form.controls['zone'];
    }

    get activityField(): AbstractControl {
        return this.form.controls['activityId'];
    }

    get classificationField(): AbstractControl {
        return this.form.controls['classificationId'];
    }

    get categoryField(): AbstractControl {
        return this.form.controls['categoryId'];
    }
}
