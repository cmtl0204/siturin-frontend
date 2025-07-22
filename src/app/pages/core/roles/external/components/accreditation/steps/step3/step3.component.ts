import { Component, effect, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Select } from 'primeng/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { PrimeIcons } from 'primeng/api';
import { ParksComponent } from './activities/parks/parks.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueTypeEnum, CoreEnum } from '@utils/enums';
import { CoreSessionStorageService } from '@utils/services';
import { ActivityInterface, CategoryInterface, ClassificationInterface } from '@modules/core/shared/interfaces';
import { ActivityService } from '@modules/core/shared/services';

interface CatalogMode {
    code: 'registration' | 'update' | 'reclassification' | 'readmission' | string;
    name?: string;
}

@Component({
    selector: 'app-step3',
    standalone: true,
    imports: [Select, FormsModule, Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, ParksComponent],
    templateUrl: './step3.component.html',
    styleUrl: './step3.component.scss'
})
export class Step3Component implements OnInit {
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);

    private readonly activityService = inject(ActivityService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly catalogueService = inject(CatalogueService);
    protected process$ = this.coreSessionStorageService.processSignal;

    protected form!: FormGroup;

    protected geographicAreas: CatalogueInterface[] = [];

    protected activities: ActivityInterface[] = [];

    protected classifications: ClassificationInterface[] = [];

    protected categories: CategoryInterface[] = [];

    constructor() {
        this.buildForm();

        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                console.log(processSignal);
            }
        });
    }

    async ngOnInit() {
        await this.loadCatalogues();
        await this.loadActivities();
        await this.watchFormChanges();

        this.setFormMode();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            geographicArea: [{ value: this.process$().activity.geographicArea, disabled: true }, [Validators.required]],
            activity: [null, [Validators.required]],
            classification: [null, [Validators.required]],
            category: [null, [Validators.required]]
        });
    }

    setFormMode(): void {
        switch (this.process$().type?.code!) {
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
    }

    async watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.activityField.valueChanges.subscribe(async (activity) => {
            if (activity) {
                this.classificationField.reset();
                this.categoryField.reset();

                this.classifications = await this.activityService.findClassificationsByActivity(activity.id);

                await this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, { activity });
            }
        });

        this.classificationField.valueChanges.subscribe(async (classification) => {
            if (classification) {
                this.categoryField.reset();
                this.categories = await this.activityService.findCategoriesByClassification(classification.id);
                await this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, { classification });
            }
        });

        this.categoryField.valueChanges.subscribe(async (category) => {
            if (category) {
                await this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, { category });
            }
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
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.geographicAreaField.invalid) errors.push('Zona Geográfica es obligatoria.');
        if (this.activityField.invalid) errors.push('Actividad es obligatoria.');
        if (this.classificationField.invalid) errors.push('Clasificación es obligatoria.');
        if (this.categoryField.invalid) errors.push('Categoría es obligatoria.');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

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

    async loadCatalogues() {
        this.geographicAreas = await this.catalogueService.findByType(CatalogueTypeEnum.activities_geographic_area);
    }

    async loadActivities() {
        this.activities = await this.activityService.findActivitiesByZone(this.geographicAreaField.getRawValue().id);
    }

    loadData() {}

    get geographicAreaField(): AbstractControl {
        return this.form.controls['geographicArea'];
    }

    get activityField(): AbstractControl {
        return this.form.controls['activity'];
    }

    get classificationField(): AbstractControl {
        return this.form.controls['classification'];
    }

    get categoryField(): AbstractControl {
        return this.form.controls['category'];
    }
}
