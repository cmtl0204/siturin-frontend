import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RegulationSimulatorFormComponent } from './components/regulation-simulator-form/regulation-simulator-form.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { FormSubmission } from './models/regulations.model';
import { CtcComponent } from './components/ctc/ctc.component';
import { Message } from 'primeng/message';
import { AccommodationContinentComponent } from './components/accommodation-continent/accommodation.component';
import { FoodDrinkContinentComponent } from './components/food-drink-continent/food-drink-continent.component';
import { FoodDrinkGalapagosComponent } from './components/food-drink-galapagos/food-drink-galapagos.component';
import { AgencyComponent } from './components/agency/agency.component';
import { ParkComponent } from './components/park/park.component';
import { TouristTransportComponent } from './components/tourist-transport/tourist-transport.component';
import { CatalogueActivitiesCodeEnum, ContributorTypeEnum } from './enum';
import { EventComponent } from './components/event/event.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { CatalogueInterface } from '@/utils/interfaces';
import { ActivityInterface, CategoryInterface, ClassificationInterface } from '../../interfaces';

@Component({
    selector: 'app-regulation-simulator',
    imports: [
        DividerModule,
        RegulationSimulatorFormComponent,
        ToggleSwitchModule,
        FormsModule,
        CtcComponent,
        Message,
        FoodDrinkContinentComponent,
        FoodDrinkGalapagosComponent,
        AgencyComponent,
        TouristTransportComponent,
        ParkComponent,
        AccommodationContinentComponent,
        EventComponent,
        RegulationComponent
    ],
    templateUrl: './regulation-simulator.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegulationSimulatorComponent {
    protected activity = signal<ActivityInterface | null>(null);
    protected classification = signal<ClassificationInterface | null>(null);
    protected geographicZone = signal<CatalogueInterface | null>(null);
    protected contributorType = signal<ContributorTypeEnum>(ContributorTypeEnum.natural_person);
    protected category = signal<CategoryInterface | null>(null);
    protected catalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum;
    protected modelId = signal<string | undefined>('');

    isProtectedArea = false;
    onRegulationSubmitted(event: FormSubmission) {
        console.log(event);
    }

    onFormValueChanges(event: any) {
        this.activity.set(event.activity);
        this.classification.set(event.classification);
        if (this.classification() && this.classification()?.hasRegulation) {
            this.modelId.set(this.classification()?.id);
        }
        this.geographicZone.set(event.geographicZone);
        this.contributorType.set(event.contributorType);
        this.category.set(event.category);
        if (this.category() && this.category()?.hasRegulation) {
            this.modelId.set(this.category()?.id);
        }
    }
}
