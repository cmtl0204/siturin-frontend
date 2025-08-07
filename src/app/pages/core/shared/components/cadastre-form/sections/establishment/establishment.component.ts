import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { CustomLabelDirective } from '../../../../shared/directives/custom-label.directive';
import { SelectModule } from 'primeng/select';
import { PrimeIcons } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-establishment',
    imports: [
        ReactiveFormsModule, 
        PanelModule, 
        InputTextModule, 
        FluidModule, 
        CardModule, 
        TagModule, 
        CustomLabelDirective, 
        SelectModule,
        ToggleSwitchModule,
    ],
    templateUrl: './establishment.component.html',
    styleUrl: './establishment.component.scss'
})
export class EstablishmentComponent implements OnInit {
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
            ruc: ['12345', Validators.required],
            code: ['12312', Validators.required],
            state: ['activo', Validators.required], //review name variable
            establishments: ['fesfse', Validators.required],
            name: ['sefes', Validators.required],
            type: ['fsefsef', Validators.required],
            legalEntity: ['fesfes', Validators.required],
            email: ['fesf@gmail.com', [Validators.required, Validators.email]],
            webPage: ['dwadawd', [Validators.required]],
            //state: ['dawdaw', Validators.required],
            //systemOrigin: ['', Validators.required],
            hasDebt: ['dawdawd', [Validators.required]],
            tradeName: ['local', [Validators.required]],
            number: ['', [Validators.required]],
            
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
        if (this.establishmentsField.invalid) errors.push('Su Establecimiento es');

        if (this.nameField.invalid) errors.push('Nombre');

        if (this.typeField.invalid) errors.push('Tipo de Personería');

        if (this.legalEntityField.invalid) errors.push('Personería jurídica');

        if (this.emailField.invalid) errors.push('Correo electrónico');

        if (this.webPageField.invalid) errors.push('Dirección Web');

        if (this.stateField.invalid) errors.push('Estado Registro del establecimiento');

        //if (this.systemOriginField.invalid) errors.push('Sistema de origen');

        if (this.hasDebtField.invalid) errors.push('Estado del Registro con deuda');

        if (this.numberField.invalid) errors.push('Número');

        if (this.tradeNameField.invalid) errors.push('Nombre comercial');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get establishmentsField(): AbstractControl {
        return this.form.controls['establishments'];
    }

    get nameField(): AbstractControl {
        return this.form.controls['name'];
    }

    get typeField(): AbstractControl {
        return this.form.controls['type'];
    }

    get legalEntityField(): AbstractControl {
        return this.form.controls['legalEntity'];
    }

    get emailField(): AbstractControl {
        return this.form.controls['email'];
    }

    get webPageField(): AbstractControl {
        return this.form.controls['webPage'];
    }

    get stateField(): AbstractControl {
        return this.form.controls['state'];
    }

    /* get systemOriginField(): AbstractControl {
        return this.form.controls['systemOrigin'];
    } */

    get hasDebtField(): AbstractControl {
        return this.form.controls['hasDebt'];
    }

    get numberField(): AbstractControl {
        return this.form.controls['number'];
    }

    get tradeNameField(): AbstractControl {
        return this.form.controls['tradeName']; 
    }            

}
