import { Component } from '@angular/core';
import {
    JuridicalPersonComponent
} from '@modules/core/roles/external/accreditation/steps/step1/juridical-person/juridical-person.component';

@Component({
    selector: 'app-step1',
    imports: [JuridicalPersonComponent],
    templateUrl: './step1.component.html',
    styleUrl: './step1.component.scss'
})
export class Step1Component {}
