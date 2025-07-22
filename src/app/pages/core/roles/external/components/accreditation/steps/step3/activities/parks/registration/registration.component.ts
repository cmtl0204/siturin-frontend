import { Component, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomMessageService } from '@utils/services';
import { EnvironmentalPermissionInfoComponent } from "../shared/environmental-permission-info/environmental-permission-info.component";
import { PeopleCapacityComponent } from "../shared/people-capacity/people-capacity.component";

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [Button, EnvironmentalPermissionInfoComponent, PeopleCapacityComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Input() showEnvironmental: boolean = false;
    @Input() showCapacity: boolean = false;

    @ViewChildren(EnvironmentalPermissionInfoComponent) private environmentalPermissionInfoComponent!: QueryList<EnvironmentalPermissionInfoComponent>;
    @ViewChildren(PeopleCapacityComponent) private peopleCapacityComponent!: QueryList<PeopleCapacityComponent>;

    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly customMessageService = inject(CustomMessageService);

    constructor() {
        this.mainForm = this.formBuilder.group({});
    }

    saveForm(childForm: FormGroup) {
        Object.keys(childForm.controls).forEach(controlName => {
            const control = childForm.get(controlName);
            if (control && !this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, control);
            } else {
                this.mainForm.get(controlName)?.patchValue(control?.value);
            }
        });
    }

    onSubmit() {
        if (this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        this.dataOut.emit(this.mainForm)
    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.environmentalPermissionInfoComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.peopleCapacityComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
