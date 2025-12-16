import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { CommonModule } from '@angular/common';
import { CatalogueActivitiesCodeEnum, CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';

import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  input,
  output
} from '@angular/core';

@Component({
  selector: 'app-physical-space',
  standalone: true,
  imports: [
    Fluid,
    CommonModule,
    ReactiveFormsModule,
    LabelDirective,
    Select,
    Message,
    ErrorMessageDirective,
    ToggleSwitchComponent
  ],
  templateUrl: './physical-space.component.html',
  styleUrl: './physical-space.component.scss'
})
export class PhysicalSpaceComponent implements OnInit {

  /*
    Antes:
      @Input() data!: string | undefined;


      dataIn = input<any>();

    - input() retorna un Signal
    - por eso se inicializa como propiedad
    - y se lee usando dataIn()
  */
  dataIn = input<any>();

  /*
    Antes:
      @Output() dataOut = new EventEmitter<FormGroup>();

    Ahora:
      dataOut = output<any>();

    - se emite SOLO el valor del formulario
    - el estado se controla en el componente padre
  */
  dataOut = output<any>();

  protected readonly Validators = Validators;
  protected readonly PrimeIcons = PrimeIcons;

  private readonly formBuilder = inject(FormBuilder);
  protected readonly customMessageService = inject(CustomMessageService);
  private readonly catalogueService = inject(CatalogueService);

  protected readonly CatalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum;

  protected form!: FormGroup;
  protected localTypes: CatalogueInterface[] = [];

  constructor() {}

  async ngOnInit() {
    /*
      buildForm() se mueve a ngOnInit
      para respetar el ciclo de vida del componente
    */
    this.buildForm();

    await this.loadCatalogues();

    /*
      se agrega carga explícita de datos desde dataIn
    */
    this.loadData();

    /*
      la escucha de cambios se hace después
      de cargar datos iniciales
    */
    this.watchFormChanges();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      localType: [null, Validators.required],

      /*
        antes se usaba reset()
        ahora se inicializa explícitamente en false
        para coincidir con park
      */
      hasLandUse: [false, Validators.requiredTrue]
    });
  }

  private loadData() {
    /*
      dataIn es un Signal, se lee con ()
    */
    const data = this.dataIn();

    if (!data) return;

    /*
      se usa patchValue para poblar el formulario
      desde datos externos
    */
    this.form.patchValue(data);
  }

  private watchFormChanges() {
    this.form.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {

        /*
          la validación ya no usa this.form.valid
          se centraliza con getFormErrors()
        */
        if (this.getFormErrors().length === 0) {

          /*
            se emite SOLO this.form.value
            no el FormGroup completo
          */
          this.dataOut.emit(this.form.value);
        }
      });
  }

  getFormErrors(): string[] {
    const errors: string[] = [];

    if (this.localTypeField.invalid) {
      errors.push('Su local es obligatorio');
    }

    if (this.hasLandUseField.invalid) {
      errors.push(
        'Al momento de la inspección se presentará el Certificado de Informe de compatibilidad de uso de suelo'
      );
    }

    /*
      si hay errores, se marcan todos los campos
      como touched para mostrar mensajes
    */
    if (errors.length > 0) {
      this.form.markAllAsTouched();
    }

    return errors;
  }

  private async loadCatalogues() {
    this.localTypes = await this.catalogueService
      .findByType(CatalogueTypeEnum.processes_local_type);
  }

  get localTypeField(): AbstractControl {
    return this.form.controls['localType'];
  }

  get hasLandUseField(): AbstractControl {
    return this.form.controls['hasLandUse'];
  }
}
