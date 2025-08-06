import { ChangeDetectionStrategy, Component, inject, OnInit, output } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { CatalogueActivitiesCodeEnum, CatalogueCtcClassificationsCodeEnum, CatalogueFoodDrinkClassificationsCodeEnum, RegulationSimulatorFormEnum } from '../../enum';
import { SelectModule } from 'primeng/select';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';

@Component({
    selector: 'app-regulation-simulator-form',
    imports: [FluidModule, SelectModule, ReactiveFormsModule, LabelDirective],
    templateUrl: './regulation-simulator-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegulationSimulatorFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    protected regulationSimulatorFormEnum = RegulationSimulatorFormEnum;
    protected contributorTypes = ['Persona Jurídica', 'Persona Natural'];
    protected activities = [
        { name: 'Alojamiento', code: CatalogueActivitiesCodeEnum.accommodation_continent },
        { name: 'Alimentos y Bebidas', code: CatalogueActivitiesCodeEnum.food_drink_continent },
        { name: 'Agencia de Viajes', code: CatalogueActivitiesCodeEnum.agency_continent },
        { name: 'Transporte Turístico', code: CatalogueActivitiesCodeEnum.transport_continent },
        { name: 'Centro de Turismo Comunitario', code: CatalogueActivitiesCodeEnum.ctc_continent }
    ];
    protected geographicZones = ['Continente', 'Galápagos'];
    protected classifications = [
        { name: 'Centro de turismo comunitario', code: CatalogueCtcClassificationsCodeEnum.community_tourism_centers },
        { name: 'Cafetería', code: CatalogueFoodDrinkClassificationsCodeEnum.cafeteria }
    ];
    protected categories = ['Catgoria única'];
    protected outputFormValue = output();
    protected form!: FormGroup;
    ngOnInit(): void {
        this.buildForm();
    }

    // todo: corregir el ts en base a ctc y food-drink-continetn
    buildForm() {
        this.form = this.fb.group({
            contributorType: [null],
            geographicZone: [null],
            activity: [null],
            classification: [null],
            category: [null]
        });
        this.onFormChanges();
    }

    get contributorTypeField(): AbstractControl {
        return this.form.controls['contributorType'];
    }

    get geographicZoneField(): AbstractControl {
        return this.form.controls['geographicZone'];
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

    onFormChanges() {
        this.form.valueChanges.subscribe((value) => {
            this.outputFormValue.emit(value);
        });
    }
    resetForm() {
        this.form.reset();
    }
}
