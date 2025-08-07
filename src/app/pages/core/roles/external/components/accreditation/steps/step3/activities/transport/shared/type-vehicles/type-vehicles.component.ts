import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FluidModule } from 'primeng/fluid';
import { CatalogueInterface } from '@utils/interfaces';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { DatePickerModule } from 'primeng/datepicker';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-type-vehicles',
    standalone: true,
    imports: [CommonModule, DatePicker, ReactiveFormsModule, ButtonModule, DialogModule, ErrorMessageDirective, TableModule, InputTextModule, InputNumberModule, SelectModule, FluidModule, DatePickerModule, Message],
    templateUrl: './type-vehicles.component.html',
    styleUrls: ['./type-vehicles.component.scss']
})
export class VehicleTypeComponent implements OnInit {
    protected readonly formBuilder = inject(FormBuilder);
    @Output() vehiclesData = new EventEmitter<FormArray>();

    // El formulario principal de este componente, que contiene el FormArray
    protected form!: FormGroup;
    // Un formulario temporal para el modal de agregar/editar un solo vehículo
    protected vehicleForm!: FormGroup;
    protected showDialog: boolean = false;
    protected selectedVehicleIndex: number | null = null;
    // Se ha actualizado la estructura para usar 'name' para p-select
    protected vehicleTypes: CatalogueInterface[] = [
        { name: 'Bus', code: 'Bus' },
        { name: 'Auto', code: 'Auto' },
        { name: 'Camioneta', code: 'Camioneta' }
    ];

    ngOnInit(): void {
        this.buildForm();
        this.buildVehicleForm();
    }

    /**
     * Construye el formulario principal con el FormArray para la lista de vehículos.
     * Esto encapsula toda la lógica de gestión de la lista dentro de este componente.
     */
    buildForm(): void {
        this.form = this.formBuilder.group({
            vehicles: this.formBuilder.array([], Validators.required)
        });
    }

    /**
     * Construye el formulario temporal que se usa en el modal.
     * Este formulario representa un único vehículo.
     */
    buildVehicleForm(): void {
        this.vehicleForm = this.formBuilder.group({
            // Se espera un objeto completo del p-select
            type: ['null', Validators.required],
            plate: ['', Validators.required],
            registrationForm: ['', Validators.required],
            capacity: ['null', [Validators.required, Validators.min(1)]],
            issueDate: ['null', Validators.required],
            expiryDate: ['null', Validators.required]
        });
    }

    private createVehicleFormGroup(vehicleData?: any): FormGroup {
        return this.formBuilder.group({
            type: [vehicleData?.type || null, Validators.required],
            plate: [vehicleData?.plate || '', Validators.required],
            registrationForm: [vehicleData?.registrationForm || '', Validators.required],
            capacity: [vehicleData?.capacity || null, [Validators.required, Validators.min(1)]],
            issueDate: [vehicleData?.issueDate || null, Validators.required],
            expiryDate: [vehicleData?.expiryDate || null, Validators.required]
        });
    }

    get vehiclesArray(): FormArray {
        return this.form.get('vehicles') as FormArray;
    }

    get typeField(): AbstractControl {
        return this.vehicleForm.controls['type'];
    }

    get plateField(): AbstractControl {
        return this.vehicleForm.controls['plate'];
    }

    get registrationFormField(): AbstractControl {
        return this.vehicleForm.controls['registrationForm'];
    }

    get capacityField(): AbstractControl {
        return this.vehicleForm.controls['capacity'];
    }

    get issueDateField(): AbstractControl {
        return this.vehicleForm.controls['issueDate'];
    }

    get expiryDateField(): AbstractControl {
        return this.vehicleForm.controls['expiryDate'];
    }

    openNewDialog(): void {
        this.selectedVehicleIndex = null;
        this.vehicleForm.reset();
        this.showDialog = true;
    }

    /**
     * Abre el modal para editar un vehículo existente.
     * @param index El índice del vehículo en el FormArray.
     */
    editVehicle(index: number): void {
        this.selectedVehicleIndex = index;
        const vehicleToEdit = this.vehiclesArray.at(index).value;
        this.vehicleForm.patchValue(vehicleToEdit);
        this.showDialog = true;
    }

    /**
     * Guarda un vehículo (nuevo o editado) en el FormArray.
     */
    saveVehicle(): void {
        if (this.vehicleForm.invalid) {
            this.vehicleForm.markAllAsTouched();
            return;
        }

        if (this.selectedVehicleIndex !== null) {
            // Edita un vehículo existente en el FormArray
            this.vehiclesArray.at(this.selectedVehicleIndex).patchValue(this.vehicleForm.value);
        } else {
            // Agrega un nuevo vehículo al FormArray
            const newVehicleFormGroup = this.createVehicleFormGroup(this.vehicleForm.value);
            this.vehiclesArray.push(newVehicleFormGroup);
        }

        this.showDialog = false;
        // Emite el FormArray completo para que el componente padre lo gestione.
        this.emitVehiclesData();
    }

    /**
     * Elimina un vehículo del FormArray.
     * @param index El índice del vehículo a eliminar.
     */
    deleteVehicle(index: number): void {
        this.vehiclesArray.removeAt(index);
        this.emitVehiclesData();
    }

    /**
     * Emite los datos del FormArray de vehículos al componente padre.
     */
    private emitVehiclesData(): void {
        this.vehiclesData.emit(this.vehiclesArray);
    }
}
