import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ColInterface } from '@utils/interfaces';

interface LandTransportInterface {
  type: string;
  plate: string;
  registration: string;
  capacity: number;
  registrationAt: Date | null;
  registrationExpirationAt: Date | null;
  certifiedCode: string;
  certifiedIssueAt: Date | null;
  certifiedExpirationAt: Date | null;
}

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  @Input() data!: string | undefined;
  @Output() dataOut = new EventEmitter<FormGroup>();

  private readonly formBuilder = inject(FormBuilder);
  protected readonly customMessageService = inject(CustomMessageService);
  private confirmationService = inject(ConfirmationService);
  protected readonly PrimeIcons = PrimeIcons;

  protected form!: FormGroup;
  protected LandTransportTypeForm!: FormGroup;
  protected buttonActions: MenuItem[] = [];

  protected isVisibleModal = false;
  protected cols: ColInterface[] = [];
  protected items: LandTransportInterface[] = [];

  ngOnInit(): void {
    this.buildForm();
    this.buildColumns();
  }

  buildForm(): void {
    this.LandTransportTypeForm = this.formBuilder.group({
      type: [null, Validators.required],
      plate: [null, [Validators.required, Validators.maxLength(20)]],
      registration: [null, Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]],
      registrationAt: [null, Validators.required],
      registrationExpirationAt: [null, Validators.required],
      certifiedCode: [null, Validators.required],
      certifiedIssueAt: [null, Validators.required],
      certifiedExpirationAt: [null, Validators.required]
    });

    this.form = this.formBuilder.group({
      hasLandTransports: [false],
      LandTransportTypes: [[]],
    });
  }

  buildColumns(): void {
    this.cols = [
      { field: 'type', header: 'Tipo' },
      { field: 'plate', header: 'Placa' },
      { field: 'registration', header: 'Formulario Matrícula' },
      { field: 'capacity', header: 'Capacidad' },
      { field: 'registrationAt', header: 'Fecha de emisión' },
      { field: 'registrationExpirationAt', header: 'Fecha de caducidad' },
      { field: 'certifiedCode', header: 'Código de Certificación' },
      { field: 'certifiedIssueAt', header: 'Fecha de Emisión' },
      { field: 'certifiedExpirationAt', header: 'Fecha de Expiración' }
    ];
  }

  validateForm(): boolean {
    const errors: string[] = [];

    if (this.typeField.invalid) errors.push('Tipo');
    if (this.plateField.invalid) errors.push('Placa');
    if (this.registrationField.invalid) errors.push('Formulario Matrícula');
    if (this.capacityField.invalid) errors.push('Capacidad');
    if (this.registrationAtField.invalid) errors.push('Fecha de emisión');
    if (this.registrationExpirationAtField.invalid) errors.push('Fecha de caducidad');
    if (this.certifiedCodeField.invalid) errors.push('Código de Certificación');
    if (this.certifiedIssueAtField.invalid) errors.push('Fecha de Emisión');
    if (this.certifiedExpirationAtField.invalid) errors.push('Fecha de Expiración');

    if (errors.length > 0) {
      this.LandTransportTypeForm.markAllAsTouched();
      this.customMessageService.showFormErrors(errors);
      return false;
    }

    return true;
  }

  create(): void {
    this.LandTransportTypeForm.reset();
    this.isVisibleModal = true;
  }

  closeModal(): void {
    this.isVisibleModal = false;
  }

  onSubmit(): void {
    this.hasLandTransportsField.setValue(true);

    if (this.validateForm()) {
      this.createLandTransportType();
    }
  }

  createLandTransportType(): void {
    this.hasLandTransportsField.setValue(true);

    this.items.push(this.LandTransportTypeForm.value);

    this.closeModal();

    this.LandTransportTypesField.setValue(this.items);

    this.dataOut.emit(this.form);
  }

  editLandTransport(item: LandTransportInterface): void {
    this.LandTransportTypeForm.patchValue(item);
    this.isVisibleModal = true;
  }

  deleteLandTransport(item: LandTransportInterface): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar?',
      header: 'Eliminar',
      icon: this.PrimeIcons.TRASH,
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.items = this.items.filter(i => i !== item);
        this.LandTransportTypesField.setValue(this.items);
        this.dataOut.emit(this.form);
      },
    });
  }

  get hasLandTransportsField(): AbstractControl {
    return this.form.controls['hasLandTransports'];
  }

  get LandTransportTypesField(): AbstractControl {
    return this.form.controls['LandTransportTypes'];
  }

  get typeField(): AbstractControl {
    return this.LandTransportTypeForm.controls['type'];
  }

  get plateField(): AbstractControl {
    return this.LandTransportTypeForm.controls['plate'];
  }

  get registrationField(): AbstractControl {
    return this.LandTransportTypeForm.controls['registration'];
  }

  get capacityField(): AbstractControl {
    return this.LandTransportTypeForm.controls['capacity'];
  }

  get registrationAtField(): AbstractControl {
    return this.LandTransportTypeForm.controls['registrationAt'];
  }

  get registrationExpirationAtField(): AbstractControl {
    return this.LandTransportTypeForm.controls['registrationExpirationAt'];
  }

  get certifiedCodeField(): AbstractControl {
    return this.LandTransportTypeForm.controls['certifiedCode'];
  }

  get certifiedIssueAtField(): AbstractControl {
    return this.LandTransportTypeForm.controls['certifiedIssueAt'];
  }

  get certifiedExpirationAtField(): AbstractControl {
    return this.LandTransportTypeForm.controls['certifiedExpirationAt'];
  }
}
