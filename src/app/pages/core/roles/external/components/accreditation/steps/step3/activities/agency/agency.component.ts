import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FluidModule } from 'primeng/fluid';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import {
    RegistrationAgencyComponent
} from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/agency/registration/registration-agency.component';

@Component({
    selector: 'app-agency',
    imports: [FormsModule, ReactiveFormsModule, FluidModule, MessageModule, InputTextModule, LabelDirective, ErrorMessageDirective, RegistrationAgencyComponent],
    templateUrl: './agency.component.html',
    styleUrl: './agency.component.scss'
})
export class AgencyComponent implements OnInit {
    @Input() processTypeCode: string = 'registration';
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit(): void {
        this.watchFormChanges();
        this.form.patchValue({ processTypeCode: this.processTypeCode });
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            processTypeCode: [null, [Validators.required]]
        });
    }

    watchFormChanges(): void {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.processTypeCodeField.invalid) {
            errors.push('Tipo de proceso');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    get processTypeCodeField(): AbstractControl {
        return this.form.controls['processTypeCode'];
    }
}
