import { Component, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { ConfirmationService, MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface, ColInterface, DpaInterface } from '@utils/interfaces';
import { deleteButtonAction, editButtonAction } from '@utils/components/button-action/consts';
import { ListBasicComponent } from '@utils/components/list-basic/list-basic.component';
import { dateGreaterThan } from '@utils/form-validators/custom-validator';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { Select } from 'primeng/select';
import { DpaService } from '@utils/services';
import { ActivityService } from '@/pages/core/shared/services';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TitleCasePipe } from '@angular/common';
import { ColorPicker } from 'primeng/colorpicker';
import { RatingModule } from 'primeng/rating';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { KnobModule } from 'primeng/knob';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputOtpModule } from 'primeng/inputotp';
import { InputMaskModule } from 'primeng/inputmask';
import { debounceTime, distinctUntilChanged } from 'rxjs';



@Component({
  selector: 'app-star-form',
  imports: [ButtonModule, MessageModule, ToastModule, CheckboxModule, ToggleButtonModule, SliderModule, KnobModule, MultiSelectModule, RatingModule, ColorPicker, 
    TitleCasePipe, ReactiveFormsModule, Fluid, ToggleSwitch, ListBasicComponent, Dialog, InputText, DatePicker, InputNumber, Select, LabelDirective, ErrorMessageDirective,
    InputTextModule, TextareaModule, InputOtpModule, InputMaskModule
  ],
  templateUrl: './star-form.html',
  styleUrl: './star-form.scss'
})
export class StarForm implements OnInit {

  public dataIn: InputSignal<any> = input<any>();
  public dataOut: OutputEmitterRef<any> = output<any>();

  private confirmationService = inject(ConfirmationService);
  protected readonly customMessageService = inject(CustomMessageService);


  protected readonly PrimeIcons = PrimeIcons;

  private readonly formBuilder = inject(FormBuilder);

  protected form!: FormGroup;
  

  protected star: any[] = [];
  protected cols: ColInterface[] = [];
  protected buttonActions: MenuItem[] = [];
  protected isVisibleModal = false;
  protected index = -1;

  value!: number;

  async ngOnInit() {
    this.loadData();
    this.buildForm();
    this.buildColumns();
  }

  loadData() {
    if (this.dataIn()) {
      this.form.patchValue(this.dataIn());
    }
  }

  
  buildForm() {
    this.form = this.formBuilder.group({
      desire: [null, [Validators.required]],
      description: [null, [Validators.required]],
      key: ["", [Validators.required]],
      power: [null, [Validators.required]],
      phone: [null, [Validators.required]]
    });

    this.watchFormChanges();
  }

  watchFormChanges() {
    this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
      if (this.getFormErrors().length === 0) {
        this.dataOut.emit(this.form.value);
      }
    });
  }

  getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.desireField.invalid) errors.push('Desire is required.');
        if (this.descriptionField.invalid) errors.push('Description is required.');
        if (this.keyField.invalid) errors.push('Key is required.');
        if (this.powerField.invalid) errors.push('Power is required.');
        if (this.phoneField.invalid) errors.push('Phone is required.');

        return errors;
  }

  createStar() {
    this.isVisibleModal = true;
  }

  editStar(index: number) {
        console.log('entro');
        console.log(index);
        if (index > -1) {
            this.form.patchValue(this.star[index]);
        }

        this.isVisibleModal = true;
    }

    deleteStar(index: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: PrimeIcons.TRASH,
            rejectButtonStyleClass: 'p-button-text',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Eliminar'
            },
            accept: () => {
                this.star.splice(index, 1);
                this.form.reset();
            },
            key: 'confirmdialog'
        });
    }

    saveStar() {
        if (this.index < 0) {
            this.star.push(this.form.value);
        } else {
            this.star[this.index] = this.form.value;
        }

        this.form.reset();
    }

  buildButtonActions({ index }: { index: number }) {
        this.index = index;

        if (this.index < 0) {
            this.customMessageService.showError({ summary: 'El registro no existe', detail: 'Vuelva a intentar' });
            return;
        }

        this.buttonActions = [
            {
                ...editButtonAction,
                command: () => {
                    this.editStar(this.index);
                }
            },
            {
                ...deleteButtonAction,
                command: () => {
                    this.deleteStar(this.index);
                }
            }
        ];
    }

  buildColumns() {
    this.cols = [
      { header: 'Deseo', field: 'desire' },
      { header: 'Descripción', field: 'description' },
      { header: 'Clave', field: 'key' },
      { header: 'Power', field: 'power' },
      { header: 'Telefono', field: 'phone' }
    ];        
  }

      validateItemForm() {
        const errors: string[] = [];

        if (this.desireField.invalid) errors.push('Deseo requerido.');
          if (this.descriptionField.invalid) errors.push('Descriptcion requerida.');
          if (this.keyField.invalid) errors.push('Codigo requerido.');
          if (this.powerField.invalid) errors.push('Poder requerido.');
          if (this.phoneField.invalid) errors.push('Numero requerido.');
        
        return errors;
      }

  closeModal() {
        this.isVisibleModal = false;
        this.form.reset();

    }

  onSubmit() {
    const errors = this.validateItemForm();
    if (errors.length === 0) {
      this.saveStar();
    } else {
      this.customMessageService.showError({ summary: 'Errores en el formulario', detail: errors.join(', ') });
    }
  }


  get desireField(): AbstractControl {
    return this.form.get('desire')!;
  }

  get descriptionField(): AbstractControl {
    return this.form.get('description')!;
  }

  get keyField(): AbstractControl {
    return this.form.get('key')!;
  }

  get powerField(): AbstractControl {
    return this.form.get('power')!;
  }

  get phoneField(): AbstractControl {
    return this.form.get('phone')!;
  }

}
