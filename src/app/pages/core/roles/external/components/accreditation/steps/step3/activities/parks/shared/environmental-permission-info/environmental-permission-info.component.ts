import { NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { PrimeIcons } from 'primeng/api';
import { FluidModule } from 'primeng/fluid';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-environmental-permission-info',
  imports: [FormsModule, ReactiveFormsModule, FluidModule, MessageModule, ErrorMessageDirective, LabelDirective, SelectModule, ToggleSwitch, NgIf],
  templateUrl: './environmental-permission-info.component.html',
  styleUrl: './environmental-permission-info.component.scss'
})
export class EnvironmentalPermissionInfoComponent implements OnInit {
  @Input() data!: string | undefined;
  @Output() dataOut = new EventEmitter<FormGroup>();
  @Output() fieldErrorsOut = new EventEmitter<string[]>();

  protected readonly PrimeIcons = PrimeIcons;
  protected readonly customMessageService = inject(CustomMessageService);
  private readonly formBuilder = inject(FormBuilder);

  protected showInspection = false;
  protected showEstablishment = false;

  protected form!: FormGroup;

  protected locality = [
    { name: 'Arrendado', code: 'Arrendado' },
    { name: 'Cedido', code: 'Cedido' },
    { name: 'Propio', code: 'Propio' }
  ];

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
    this.dataOut.emit(this.form);
    this.watchFormChanges();

    this.form.get('locality')?.valueChanges.subscribe((value: string) => {
      if (value) {
        this.showEstablishment = true;
      } else {
        this.showInspection = false;
        this.showEstablishment = false;
        this.form.get('establishmentId')?.reset();
        this.form.get('inspection')?.reset();
      }
    });

    this.form.get('establishmentId')?.valueChanges.subscribe((value: boolean) => {
      this.showInspection = value;

      if (!value) {
        this.form.get('ispection')?.reset();
      }
    })
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      locality: [null, Validators.required],
      establishmentId: [null, Validators.required],
      inspection: [false, Validators.requiredTrue]
    });
  }

  watchFormChanges(): void {
    this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      if (this.form.valid) {
        this.dataOut.emit(this.form);
      }
    });
  }

  get localityField(): AbstractControl {
    return this.form.controls['locality'];
  }

  get establishmentField(): AbstractControl {
    return this.form.controls['establishmentId'];
  }

  get inspectionField(): AbstractControl {
    return this.form.controls['inspection'];
  }


  getFormErrors(): string[] {
    const errors: string[] = [];

    if (this.localityField.invalid) {
      errors.push('Debe seleccionar una opción para "Su local es".');
    }

    if (this.establishmentField.invalid) {
      errors.push('Debe seleccionar si el establecimiento está dentro del Subsistema Estatal.');
    }

    if (this.inspectionField.invalid) {
      errors.push('Debe seleccionar si la inspección se presentará con los documentos adecuados.');
    }

    if (errors.length > 0) {
      this.form.markAllAsTouched();
    }

    return errors;
  }
}
