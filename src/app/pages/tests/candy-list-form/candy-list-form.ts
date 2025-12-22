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
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
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
  selector: 'app-candy-list-form',
  imports: [Fluid, ReactiveFormsModule, DatePicker, LabelDirective, Message, ErrorMessageDirective, ToggleSwitch, TableModule, Button, Dialog, InputText,
    CheckboxModule, ToastModule, ButtonModule, MessageModule, TitleCasePipe, ColorPicker, RatingModule, MultiSelectModule, ToggleButtonModule, SliderModule, KnobModule,
    InputTextModule, TextareaModule, InputOtpModule, InputMaskModule, ListBasicComponent, InputNumberModule 
  ],
  templateUrl: './candy-list-form.html',
  styleUrl: './candy-list-form.scss'
})
export class CandyListForm {

  public dataIn: InputSignal<any> = input<any>();
  public dataOut: OutputEmitterRef<any> = output<any>();

  protected readonly PrimeIcons = PrimeIcons;

  protected readonly catalogueService = inject(CatalogueService);
  protected readonly customMessageService = inject(CustomMessageService);
  private confirmationService = inject(ConfirmationService);

  private readonly formBuilder = inject(FormBuilder);
  protected form!: FormGroup;
  protected itemForm!: FormGroup;

  protected items: any[] = [];
  protected cols: ColInterface[] = [];
  protected buttonActions: MenuItem[] = [];
  protected isVisibleModal = false;
  protected index = -1;

  protected localTypes: CatalogueInterface[] = [];

  constructor() {}

  async ngOnInit() {
    await this.loadCatalogues();
    this.loadData();
    this.buildForm();
    this.buildColumns();
  }

  loadData() {
    if (this.dataIn()) {
      this.form.patchValue(this.dataIn());
    }
  }

  async loadCatalogues() {
    this.localTypes = await this.catalogueService.findByType(CatalogueTypeEnum.processes_local_type);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      furniture: [false, [Validators.required]], 
      items: []
    });

    this.itemForm = this.formBuilder.group({
      name: [null, Validators.required],                       
      quantity: [null, [Validators.required, Validators.min(1)]], 
      deliveryDate: [null, Validators.required],               
      color: [null, Validators.required],
      localType: [null, [Validators.required]],
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

    if (this.furnitureField.value && this.items.length === 0) {
      errors.push('Debe agregar al menos un mueble para entrega');
    }

    if (errors.length > 0) {
      this.form.markAllAsTouched();
    }

    return errors;
  }

  buildButtonActions({ index }: { index: number }) {
    this.index = index;

    if (this.index < 0) {
      this.customMessageService.showError({ summary: 'El registro no existe', detail: 'Vuelva a intentar' });
      return;
    }

    this.buttonActions = [
      {
        icon: PrimeIcons.PENCIL,
        label: 'Editar',
        command: () => {
          this.editItem(this.index);
        }
      },
      {
        icon: PrimeIcons.TRASH,
        label: 'Eliminar',
        command: () => {
          this.deleteItem(this.index);
        }
      }
    ];
  }

  buildColumns() {
    this.cols = [
      { header: 'Nombre del mueble', field: 'name' },
      { header: 'Cantidad', field: 'quantity' },
      { header: 'Fecha de entrega', field: 'deliveryDate', type: 'date' },
      { header: 'Color', field: 'color' }
    ];
  }

  validateItemForm() {
    const errors: string[] = [];

    if (this.nameField.invalid) errors.push('Nombre del mueble');
    if (this.quantityField.invalid) errors.push('Cantidad');
    if (this.deliveryDateField.invalid) errors.push('Fecha de entrega');
    if (this.colorField.invalid) errors.push('Color del mueble');

    if (errors.length > 0) {
      this.form.markAllAsTouched();
      this.customMessageService.showFormErrors(errors);
      return false;
    }

    return true;
  }

  createItem() {
    this.isVisibleModal = true;
  }

  editItem(index: number) {
    if (index > -1) {
      this.itemForm.patchValue(this.items[index]);
    }
    this.isVisibleModal = true;
  }

  deleteItem(index: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este mueble?',
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
        this.items.splice(index, 1);
        this.itemsField.setValue(this.items);
      },
      key: 'confirmdialog'
    });
  }

  saveItem() {
    if (this.index < 0) {
      this.items.push(this.itemForm.value);
    } else {
      this.items[this.index] = this.itemForm.value;
    }

    this.itemsField.setValue(this.items);
    this.closeModal();
  }

  closeModal() {
    this.isVisibleModal = false;
    this.itemForm.reset();
  }

  onSubmit() {
    if (this.validateItemForm()) {
      this.saveItem();
    }
  }

  get furnitureField(): AbstractControl {
    return this.form.controls['furniture'];
  }

  get itemsField(): AbstractControl {
    return this.form.controls['items'];
  }

  get nameField(): AbstractControl {
    return this.itemForm.controls['name'];
  }

  get quantityField(): AbstractControl {
    return this.itemForm.controls['quantity'];
  }

  get deliveryDateField(): AbstractControl {
    return this.itemForm.controls['deliveryDate'];
  }

  get colorField(): AbstractControl {
    return this.itemForm.controls['color'];
  }

  get localTypeField(): AbstractControl {
    return this.form.controls['localType'];
  }
}
