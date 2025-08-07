import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  AbstractControl
} from '@angular/forms';
import {
  ButtonModule
} from 'primeng/button';
import {
  DialogModule
} from 'primeng/dialog';
import {
  TableModule
} from 'primeng/table';
import {
  InputTextModule
} from 'primeng/inputtext';
import {
  InputNumberModule
} from 'primeng/inputnumber';
import {
  CalendarModule
} from 'primeng/calendar';
import {
  SelectModule
} from 'primeng/select';
import {
  FluidModule
} from 'primeng/fluid';
import {
  DatePickerModule
} from 'primeng/datepicker';
import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs';

@Component({
  selector: 'app-type-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    SelectModule,
    FluidModule,
    DatePickerModule
  ],
  templateUrl: './type-vehicles.component.html',
  styleUrls: ['./type-vehicles.component.scss'],
})
export class VehicleTypeComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly cd = inject(ChangeDetectorRef);

  @Output() vehiclesData = new EventEmitter<FormArray>();
  @Output() fieldErrorsOut = new EventEmitter<string[]>();
  @Output() dataOut = new EventEmitter<FormGroup>();

  protected form!: FormGroup;
  protected vehicleForm!: FormGroup;

  protected showDialog: boolean = false;
  protected showDropdown: boolean = false;
  protected selectedVehicleIndex: number | null = null;

  protected vehicleTypes: any[] = [
    { name: 'Bus', code: 'Bus' },
    { name: 'Auto', code: 'Auto' },
    { name: 'Camioneta', code: 'Camioneta' },
  ];

  ngOnInit(): void {
    this.buildForm();
    this.buildVehicleForm();
    this.watchFormChanges();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      vehicles: this.formBuilder.array([], Validators.required),
    });
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (errors.length > 0) {
      this.form.markAllAsTouched();
      return errors;
    }
    return [];
  }

  watchFormChanges() {
    this.form.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.form.valid) {
        this.dataOut.emit(this.form);
      }
    });
  }

  buildVehicleForm(): void {
    this.vehicleForm = this.formBuilder.group({
      type: [null, Validators.required],
      plate: ['', Validators.required],
      registrationForm: ['', Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]],
      issueDate: [null, Validators.required],
      expiryDate: [null, Validators.required],
    });
  }

  private createVehicleFormGroup(vehicleData?: any): FormGroup {
    return this.formBuilder.group({
      type: [vehicleData?.type || null, Validators.required],
      plate: [vehicleData?.plate || '', Validators.required],
      registrationForm: [vehicleData?.registrationForm || '', Validators.required],
      capacity: [vehicleData?.capacity || null, [Validators.required, Validators.min(1)]],
      issueDate: [vehicleData?.issueDate || null, Validators.required],
      expiryDate: [vehicleData?.expiryDate || null, Validators.required],
    });
  }

  get vehiclesArray(): FormArray {
    return this.form.get('vehicles') as FormArray;
  }

  get typeField(): AbstractControl {
    return this.vehicleForm.controls['type'];
  }

  openNewDialog(): void {
    this.selectedVehicleIndex = null;
    this.vehicleForm.reset();
    this.showDialog = false;
    this.showDropdown = false;

    setTimeout(() => {
      this.showDialog = true;
      this.showDropdown = true;
      this.cd.detectChanges();
    });
  }

  editVehicle(index: number): void {
    this.selectedVehicleIndex = index;
    const vehicleToEdit = this.vehiclesArray.at(index).value;
    this.vehicleForm.patchValue(vehicleToEdit);
    this.showDialog = false;
    this.showDropdown = false;

    setTimeout(() => {
      this.showDialog = true;
      this.showDropdown = true;
      this.cd.detectChanges();
    });
  }

  saveVehicle(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    if (this.selectedVehicleIndex !== null) {
      this.vehiclesArray.at(this.selectedVehicleIndex).patchValue(this.vehicleForm.value);
    } else {
      const newVehicleFormGroup = this.createVehicleFormGroup(this.vehicleForm.value);
      this.vehiclesArray.push(newVehicleFormGroup);
    }

    this.showDialog = false;
    this.showDropdown = false;
    this.emitVehiclesData();
  }

  deleteVehicle(index: number): void {
    this.vehiclesArray.removeAt(index);
    this.emitVehiclesData();
  }

  private emitVehiclesData(): void {
    this.vehiclesData.emit(this.vehiclesArray);
  }
}
