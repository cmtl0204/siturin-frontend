import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    RegistrationComponent
} from '@modules/core/roles/external/components/accreditation/steps/step3/activities/agency/registration/registration.component';

@Component({
    selector: 'app-agency',
    imports: [RegistrationComponent],
    templateUrl: './agency.component.html',
    styleUrl: './agency.component.scss'
})
export class AgencyComponent {
    @Input() processTypeCode: string = 'registration';
}
