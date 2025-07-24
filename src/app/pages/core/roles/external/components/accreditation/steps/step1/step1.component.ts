import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomMessageService } from '@utils/services';
import { JuridicalPersonComponent } from '@modules/core/roles/external/components/accreditation/steps/step1/juridical-person/juridical-person.component';
import { Button } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { SriComponent } from '@modules/core/shared/components/sri/sri.component';

@Component({
    selector: 'app-step1',
    imports: [JuridicalPersonComponent, Button, Fluid, SriComponent],
    templateUrl: './step1.component.html',
    styleUrl: './step1.component.scss'
})
export class Step1Component {
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly router = inject(Router);

    @Output() step: EventEmitter<number> = new EventEmitter<number>();
    @ViewChildren(JuridicalPersonComponent) private juridicalPersonComponent!: QueryList<JuridicalPersonComponent>;

    private formBuilder = inject(FormBuilder);
    protected mainForm!: FormGroup;

    protected readonly customMessageService = inject(CustomMessageService);

    constructor() {
        this.mainForm = this.formBuilder.group({});
    }

    saveForm(childForm: FormGroup) {
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    onSubmit() {
        if (this.checkFormErrors()) this.saveProcess();
    }

    checkFormErrors() {
        const errors: string[] = [...this.juridicalPersonComponent.toArray().flatMap((c) => c.getFormErrors())];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    saveProcess() {
        console.log(this.mainForm.value);
        this.step.emit(2);
    }

    back() {
        this.router.navigateByUrl(MY_ROUTES.corePages.external.establishment.absolute);
    }
}
