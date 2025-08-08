import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { CatalogueActivitiesCodeEnum, CatalogueCtcClassificationsCodeEnum, CatalogueFoodDrinkClassificationsCodeEnum, ContributorTypeEnum, RegulationSimulatorFormEnum } from '../../enum';
import { SelectModule } from 'primeng/select';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ActivityInterface, ClassificationInterface, CategoryInterface } from '@/pages/core/shared/interfaces';
import { CatalogueInterface } from '@/utils/interfaces';
import { ActivityService } from '@/pages/core/shared/services';
import { CoreSessionStorageService } from '@/utils/services';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { CatalogueProcessesTypeEnum, CatalogueTypeEnum, CoreEnum } from '@/utils/enums';

@Component({
    selector: 'app-regulation-simulator-form',
    imports: [FluidModule, SelectModule, ReactiveFormsModule, LabelDirective],
    templateUrl: './regulation-simulator-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegulationSimulatorFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly activityService = inject(ActivityService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly catalogueService = inject(CatalogueService);
    protected regulationSimulatorFormEnum = RegulationSimulatorFormEnum;

    protected contributorTypes = [
        { name: 'Persona Natural', code: ContributorTypeEnum.natural_person },
        { name: 'Persona Jurídica', code: ContributorTypeEnum.juridical_person }
    ];
    protected geographicAreas: CatalogueInterface[] = [];
    protected activities: ActivityInterface[] = [];
    protected classifications: ClassificationInterface[] = [];
    protected categories: CategoryInterface[] = [];
    protected outputFormValue = output();
    protected form!: FormGroup;

    ngOnInit(): void {
        this.buildForm();
        this.loadCatalogues();
        this.watchFormChanges();
    }

    buildForm() {
        this.form = this.fb.group({
            contributorType: [null],
            geographicArea: [null],
            activity: [null],
            classification: [null],
            category: [null]
        });
    }

    async watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
            this.outputFormValue.emit(value);
        });

        this.geographicAreaField.valueChanges.subscribe(async (geographicArea) => {
            if (geographicArea) {
                this.activities = await this.activityService.findActivitiesByZone(geographicArea.id);
            }
        });

        this.activityField.valueChanges.subscribe(async (activity) => {
            if (activity) {
                this.classifications = await this.activityService.findClassificationsByActivity(activity.id);
            }
        });

        this.classificationField.valueChanges.subscribe(async (classification) => {
            if (classification) {
                this.categories = await this.activityService.findCategoriesByClassification(classification.id);
            }
        });

        // this.categoryField.valueChanges.subscribe(async (category) => {
        //     if (category) {
        //         // TODO
        //     }
        // });
    }

    async loadCatalogues() {
        this.geographicAreas = await this.catalogueService.findByType(CatalogueTypeEnum.activities_geographic_area);
    }

    async loadActivities() {
        if (this.geographicAreaField.value === 'continent') {
            this.activities = await this.activityService.findActivitiesByZone(this.geographicAreaField.getRawValue().id);
        } else if (this.geographicAreaField.value === 'galapagos') {
            this.activities = await this.activityService.findActivitiesByZone(this.geographicAreaField.getRawValue().id);
        }
    }

    get contributorTypeField(): AbstractControl {
        return this.form.controls['contributorType'];
    }

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
