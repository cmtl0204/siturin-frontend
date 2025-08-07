import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
import { ParkGalapagosComponent } from './components/park-galapagos/park-galapagos.component';
import { TouristTransportComponent } from './components/tourist-transport/tourist-transport.component';
import { CatalogueActivitiesCodeEnum } from './enum';
import { EventComponent } from './components/event/event.component';
import { RegulationComponent } from '@modules/core/shared/components/regulation/regulation.component';

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
        ParkGalapagosComponent,
        AccommodationContinentComponent,
        EventComponent,
        RegulationComponent
    ],
    templateUrl: './regulation-simulator.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegulationSimulatorComponent {
    protected activity = signal<string>('');
    protected classification = signal<string>('');
    protected geographicZone = signal<string>('');
    protected person = signal<string>('');
    protected category = signal<string>('');
    protected catalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum;

    prueba = false;
    changeNumber = '2';
    onRegulationSubmitted(event: FormSubmission) {
        console.log(event);
    }

    onFormValueChanges(event: any) {
        this.activity.set(event.activity);
        this.classification.set(event.classification);
        this.geographicZone.set(event.geographicZone);
        this.person.set(event.contributorType);
        this.category.set(event.category);
    }
}
