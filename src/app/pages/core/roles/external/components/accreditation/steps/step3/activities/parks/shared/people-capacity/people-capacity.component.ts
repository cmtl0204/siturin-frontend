import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { PrimeIcons } from 'primeng/api';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-people-capacity',
  imports: [FormsModule,ReactiveFormsModule,FluidModule,MessageModule,ErrorMessageDirective,LabelDirective,InputNumberModule],
  templateUrl: './people-capacity.component.html',
  styleUrl: './people-capacity.component.scss'
})
export class PeopleCapacityComponent implements OnInit {
  @Input() data!: string | undefined;
  @Output() dataOut = new EventEmitter<FormGroup>();
  @Output() fieldErrorsOut = new EventEmitter<string[]>();

  protected readonly PrimeIcons = PrimeIcons;
  private readonly _formBuilder = inject(FormBuilder);
  protected readonly _customMessageService = inject(CustomMessageService);

  protected form!: FormGroup; //poner public

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
    this.dataOut.emit(this.form);
    this.watchFormChanges();
  }

  buildForm(): void {
    this.form = this._formBuilder.group({
      totalCapacities: [null, [Validators.required, Validators.min(0), Validators.max(500)]]
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
    const control = this.capacityField;

    if (control.invalid) {
      if (control.errors?.['required']) {
        errors.push('Debe ingresar la capacidad en número de personas.');
      }
      if (control.errors?.['min']) {
        errors.push('La capacidad no puede ser menor a 0.');
      }
      if (control.errors?.['max']) {
        errors.push('La capacidad no puede ser mayor a 500.');
      }
    }

    if (errors.length > 0) {
      console.log('Errores en PeopleCapacityComponent:', errors);
      this.form.markAllAsTouched();
    }

    return errors;
  }

  get capacityField(): AbstractControl {
    return this.form.controls['totalCapacities'];
  }
}
