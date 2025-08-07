import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Message } from 'primeng/message';
import { Divider } from 'primeng/divider';
import { MultiSelect } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-establishment-services',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, Message, Divider, MultiSelect, CommonModule],
    templateUrl: './establishment-services.component.html',
    styleUrl: './establishment-services.component.scss'
})
export class EstablishmentServicesComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    //protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;

    protected serviceTypes: any[] = [
        { name: 'Autoservicio', id: '1' },
        { name: 'Bufet', id: '2' },
        { name: 'Menú', id: '3' },
        { name: 'Menú fijo', id: '4' },
        { name: 'Servicio a Domicilio', id: '5' },
        { name: 'Servicio al auto', id: '6' }
    ];

    protected kitchenTypes: any[] = [
        { name: 'Africana', id: '1' },
        { name: 'Alemana', id: '2' },
        { name: 'Americana', id: '3' },
        { name: 'Argentina', id: '4' },
        { name: 'Asiática', id: '5' },
        { name: 'Australiana', id: '6' },
        { name: 'Brasilera', id: '7' },
        { name: 'Chilena', id: '8' },
        { name: 'China', id: '9' },
        { name: 'Cocina Andina', id: '10' },
        { name: 'Cocina Patrimonial', id: '11' },
        { name: 'Colombiana', id: '12' },
        { name: 'Coreana', id: '13' },
        { name: 'Costa Rica', id: '14' },
        { name: 'Cubana', id: '15' },
        { name: 'Dominicana', id: '16' },
        { name: 'Ecuatoriana', id: '17' },
        { name: 'Escandinava', id: '18' },
        { name: 'Española', id: '19' }
    ];

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    onSubmit() {
        console.log(this.form.value);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            serviceTypes: [[], [Validators.required]],
            kitchenTypes: [[], [Validators.required]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.serviceTypesField.invalid) errors.push('Tipo de Servicio');
        if (this.kitchenTypesField.invalid) errors.push('Tipo de Cocina');
        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get serviceTypesField(): AbstractControl {
        return this.form.controls['serviceTypes'];
    }
    
    get kitchenTypesField(): AbstractControl {
        return this.form.controls['kitchenTypes'];
    }    

}
