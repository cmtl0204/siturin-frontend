import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { PhysicalSpaceComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/agency/registration/physical-space/physical-space.component';
import { AccreditedStaffLanguageComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/agency/registration/accredited-staff-language/accredited-staff-language.component';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomMessageService } from '@utils/services';

@Component({
    selector: 'app-registration',
    imports: [PhysicalSpaceComponent, AccreditedStaffLanguageComponent, Button],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(AccreditedStaffLanguageComponent) private accreditedStaffLanguageComponent!: QueryList<AccreditedStaffLanguageComponent>;
    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;

    private formBuilder = inject(FormBuilder);
    protected mainForm!: FormGroup;

    protected readonly _customMessageService = inject(CustomMessageService);

    constructor() {
        this.mainForm = this.formBuilder.group({});
    }

    saveForm(childForm: FormGroup) {
        this.mainForm.patchValue(childForm.value);
    }

    onSubmit() {
        if (!this.checkFormErrors()) {
         this.saveProcess();
        }
    }

    saveProcess(){

    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.accreditedStaffLanguageComponent.toArray().flatMap(c => c.getFormErrors()),
            ...this.physicalSpaceComponent.toArray().flatMap(c => c.getFormErrors())
        ]

        if (errors.length > 0) {
            this._customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
