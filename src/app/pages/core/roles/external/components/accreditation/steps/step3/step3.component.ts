import { Component, inject } from '@angular/core';
import { Select } from 'primeng/select';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { PrimeIcons } from 'primeng/api';
import { AgencyComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/agency/agency.component';
import { CatalogueInterface } from '@utils/interfaces';

@Component({
    selector: 'app-step3',
    imports: [Select, FormsModule, Button, Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, AgencyComponent],
    templateUrl: './step3.component.html',
    styleUrl: './step3.component.scss'
})
export class Step3Component {
    private readonly _formBuilder = inject(FormBuilder);
    protected zones: any[] = [
        { id: '1', name: 'Local 1' },
        { id: '2', name: 'Local 2' }
    ];
    protected activities: string[] = [];
    protected classifications: string[] = [];
    protected categories: string[] = [];
    protected form!: FormGroup;

    constructor() {
        this.buildForm();
    }

    buildForm() {
        this.form = this._formBuilder.group({
            zone: [null, [Validators.required]],
            activity: [null, [Validators.required]],
            classification: [null, [Validators.required]],
            category: [null, [Validators.required]]
        });
    }

    onSubmit() {}

    get zoneField(): AbstractControl {
        return this.form.controls['zone'];
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

    protected readonly PrimeIcons = PrimeIcons;
}
