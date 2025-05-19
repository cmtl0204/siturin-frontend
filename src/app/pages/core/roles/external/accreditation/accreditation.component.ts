import { Component, inject } from '@angular/core';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Step1Component } from '@modules/core/roles/external/accreditation/steps/step1/step1.component';
import { Step2Component } from '@modules/core/roles/external/accreditation/steps/step2/step2.component';
import { Step3Component } from '@modules/core/roles/external/accreditation/steps/step3/step3.component';
import { BreadcrumbService } from '../../../../../layout/service/breadcrumb.service';

@Component({
    selector: 'app-accreditation',
    imports: [Stepper, StepList, Step, NgClass, StepPanels, StepPanel, FormsModule, Password, Button, Step1Component, Step2Component, Step3Component],
    templateUrl: './accreditation.component.html',
    styleUrl: './accreditation.component.scss'
})
export class AccreditationComponent {
    private readonly _breadcrumbService = inject(BreadcrumbService);
    protected activeStep: number = 3;

    constructor() {
        this._breadcrumbService.setItems([{ label: 'Proceso de Acreditación de Actividades Turísticas' }]);
    }
}
