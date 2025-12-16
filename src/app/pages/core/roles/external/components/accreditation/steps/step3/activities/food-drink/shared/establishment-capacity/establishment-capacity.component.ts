import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { Divider } from 'primeng/divider';
import { InputNumber } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CatalogueActivitiesCodeEnum, CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueService } from '@/utils/services/catalogue.service';

import {
  Component,
  OnInit,
  inject,
  input,
  output
} from '@angular/core';


@Component({
    selector: 'app-establishment-capacity',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, Divider, InputNumber, CommonModule],
    templateUrl: './establishment-capacity.component.html',
    styleUrl: './establishment-capacity.component.scss'
})
export class EstablishmentCapacityComponent implements OnInit {

    /*
      Antes:
        @Input() data!: string | undefined;

      Ahora:
        input()
        → se lee con dataIn()
    */
    dataIn = input<any>(); 

    /*
      Antes:
        @Output() dataOut = new EventEmitter<FormGroup>();

      Ahora:
        output()
        → se emite SOLO form.value
    */
    dataOut = output<any>(); 

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly catalogueService = inject(CatalogueService);

    protected readonly CatalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum;

    protected form!: FormGroup;

    protected typeEstablishments: CatalogueInterface[] = [];

    /*
      Antes:
        buildForm() en el constructor

        constructor vacío
    */
    constructor() {} 
    ngOnInit() {

        /*
          buildForm pasa a ngOnInit
        */
        this.buildForm(); 

        /*
          Cargar data antes de escuchar cambios
        */
        this.loadData(); 

        this.watchFormChanges();
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            totalTables: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
            totalCapacities: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
        });

        /*
         Eliminado watchFormChanges() de aquí
          porque se estaba duplicando la suscripción
        */
    }

    private watchFormChanges() {
        this.form.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(() => {
                if (this.form.valid) {
                    /*
                      Antes:
                        this.dataOut.emit(this.form);

                      Ahora:
                        se emite SOLO el value
                    */
                    this.dataOut.emit(this.form.value); 
                }
            });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.tablesField.invalid) {
            errors.push('Número de mesas');
        }

        if (this.capacityField.invalid) {
            errors.push('Capacidad en número de personas');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    async loadCatalogues() {
        this.typeEstablishments = await this.catalogueService.findByType(
            CatalogueTypeEnum.process_food_drinks_establishment_type
        );
    }

    private loadData() {
        /*
          dataIn es Signal → se lee con ()
        */
        const data = this.dataIn(); 
        if (!data) return;

        this.form.patchValue(data);
    }

    get tablesField(): AbstractControl {
        return this.form.controls['totalTables'];
    }

    get capacityField(): AbstractControl {
        return this.form.controls['totalCapacities'];
    }
}