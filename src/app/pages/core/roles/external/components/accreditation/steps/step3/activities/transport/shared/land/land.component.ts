import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { VehicleTypeComponent } from '../type-vehicles/type-vehicles.component';

@Component({
    selector: 'app-land',
    imports: [
    ReactiveFormsModule,
    FluidModule,
    SelectModule,
    LabelDirective,
    ErrorMessageDirective,
    ToggleSwitchModule,
    InputTextModule,
    DatePickerModule,
    InputNumberModule,
    VehicleTypeComponent
],
    templateUrl: './land.component.html',
    styleUrl: './land.component.scss'
})
export class LandComponent {
    protected readonly formBuilder = inject(FormBuilder);
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected form!: FormGroup;

    protected localTypes: CatalogueInterface[] = [
        { name: 'Islas de Centros Comerciales', code: 'islas' },
        { name: 'Local Comercial', code: 'comercial' },
        { name: 'Oficinas', code: 'oficinas' },
        { name: 'Oficinas Compartidas', code: 'compartidas' }
    ];

    ngOnInit(): void {
        this.buildForm();
        this.watchFormChanges();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            localType: [null, Validators.required],
            certified: [null, Validators.required],
            certifiedCode: [null, Validators.required],
            certifiedIssueAt: [null, Validators.required],
            certifiedExpirationAt: [null, Validators.required]
        });
    }

    watchFormChanges() {
    this.localTypeField.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.certifiedField.setValidators([Validators.required]);
      } else {
        this.certifiedField.clearValidators();
        this.certifiedField.setValue(false);
      }
      this.certifiedField.updateValueAndValidity();
    });

    this.certifiedField.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.certifiedCodeField.setValidators([Validators.required]);
      } else {
        this.certifiedCodeField.clearValidators();
        this.certifiedCodeField.setValue(false);
      }
      this.certifiedCodeField.updateValueAndValidity();
    });


    this.form.valueChanges.subscribe(() => {
      if (this.form.valid) {
        this.dataOut.emit(this.form);
      }
    });
  }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    get certifiedField(): AbstractControl {
        return this.form.controls['certified'];
    }

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get certifiedCodeField(): AbstractControl {
        return this.form.controls['certifiedCode'];
    }

    get certifiedIssueAtField(): AbstractControl {
        return this.form.controls['certifiedIssueAt'];
    }

    get certifiedExpirationAtField(): AbstractControl {
        return this.form.controls['certifiedExpirationAt'];
    }
}
