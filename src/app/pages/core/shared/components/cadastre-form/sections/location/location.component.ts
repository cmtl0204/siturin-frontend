import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomLabelDirective } from '../../../../shared/directives/custom-label.directive';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-location',
    imports: [ReactiveFormsModule, FluidModule, InputTextModule, CustomLabelDirective, SelectButtonModule, SelectModule],
    templateUrl: './location.component.html',
    styleUrl: './location.component.scss'
})
export class LocationComponent {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    //protected readonly customMessageService = inject(CustomMessageService);
    protected form!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            province : ['wadaw', Validators.required],
            canton : ['dawdaw', Validators.required],
            parish : ['dawda', Validators.required],
            parishType : ['dwada', Validators.required],
            address : ['dwadaw', Validators.required],
            referenceStreet : ['', Validators.required],
            latitude : [{value: 'dawdaw', disabled:true}, Validators.required],
            longitude : [{value: 'dawdaw', disabled:true}, Validators.required],
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
        if (this.provinceField.invalid) errors.push('Seleccione una provincia correcta');

        if (this.cantonField.invalid) errors.push('Seleccione un cantón correcta');

        if (this.parishField.invalid) errors.push('Seleccione una parroquia correcta');

        if (this.parishTypeField.invalid) errors.push('Seleccione un tipo de parroquia correcta');

        if (this.addressField.invalid) errors.push('Dirección incorrecta');

        if (this.referenceStreetField.invalid) errors.push('Calle de referencia incorrecta');

        if (this.latitudeField.invalid) errors.push('Latitud');

        if (this.longitudeField.invalid) errors.push('Longitud');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get provinceField() {
        return this.form.controls['province'];
    }

    get cantonField() {
        return this.form.controls['canton'];
    }

    get parishField() {
        return this.form.controls['parish'];
    }

    get parishTypeField() {
        return this.form.controls['parishType'];
    }

    get addressField() {
        return this.form.controls['address'];
    }

    get referenceStreetField() {
        return this.form.controls['referenceStreet'];
    }

    get latitudeField() {
        return this.form.controls['latitude'];
    }

    get longitudeField() {
        return this.form.controls['longitude'];
    }
}
