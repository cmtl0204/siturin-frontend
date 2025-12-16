import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { CatalogueInterface } from '@utils/interfaces';

import {
  CatalogueActivitiesCodeEnum,
  CatalogueProcessFoodDrinksEstablishmentTypeEnum,
  CatalogueTypeEnum
} from '@/utils/enums';

import {
  Component,
  inject,
  OnInit,
  input,
  output
} from '@angular/core';


@Component({
    selector: 'app-establishment-type',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, InputText, CommonModule, ToggleSwitchComponent],
    templateUrl: './establishment-type.component.html',
    styleUrl: './establishment-type.component.scss'
})
export class EstablishmentTypeComponent implements OnInit {

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
    protected establishmentTypes: CatalogueInterface[] = [];

    constructor() {}

    async ngOnInit() {

        /*
          buildForm() pasa a ngOnInit
        */
        this.buildForm();

        await this.loadCatalogues();

        /*
          Se carga data ANTES de escuchar cambios
        */
        this.loadData();

        /*
          watchFormChanges se ejecuta al final
        */
        this.watchFormChanges();
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            establishmentType: [null, [Validators.required]],
            establishmentName: [null],
            /*
              Validators dinámicos
            */
            hasFranchiseGrantCertificate: [null]
        });
    }

    private watchFormChanges() {

        /*
          Se emite SOLO el value, no el FormGroup
        */
        this.form.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(() => {
                if (this.getFormErrors().length === 0) {
                    this.dataOut.emit(this.form.value);
                }
            });

        /*
          Validadores dinámicos optimizados
        */
        this.establishmentTypeField.valueChanges.subscribe((value) => {
            const code = value?.code;
            if (!code) return;

            // Limpiar siempre primero
            this.establishmentNameField.clearValidators();
            this.hasFranchiseGrantCertificateField.clearValidators();

            // Todos excepto "ninguno" requieren nombre
            if (code !== CatalogueProcessFoodDrinksEstablishmentTypeEnum.ninguno) {
                this.establishmentNameField.setValidators([Validators.required]);
            }

            // Solo franquicia requiere certificado
            if (code === CatalogueProcessFoodDrinksEstablishmentTypeEnum.franquicia) {
                this.hasFranchiseGrantCertificateField.setValidators([Validators.required]);
            }

            // Refrescar validez
            this.establishmentNameField.updateValueAndValidity();
            this.hasFranchiseGrantCertificateField.updateValueAndValidity();
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.establishmentTypeField.invalid) {
            errors.push('Tipo de Establecimiento');
        }

        if (this.establishmentNameField.invalid) {
            errors.push('Nombre de la Franquicia o Cadena');
        }

        if (this.hasFranchiseGrantCertificateField.invalid) {
            errors.push('Certificación de concesión de la franquicia');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    private async loadCatalogues() {
        this.establishmentTypes = await this.catalogueService.findByType(
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

    get establishmentTypeField(): AbstractControl {
        return this.form.controls['establishmentType'];
    }

    get establishmentNameField(): AbstractControl {
        return this.form.controls['establishmentName'];
    }

    get hasFranchiseGrantCertificateField(): AbstractControl {
        return this.form.controls['hasFranchiseGrantCertificate'];
    }
}
