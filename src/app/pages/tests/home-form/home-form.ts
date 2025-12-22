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
  selector: 'app-home-form',
  imports: [Fluid, ReactiveFormsModule, DatePicker, LabelDirective, Message, ErrorMessageDirective, ToggleSwitch, TableModule, Button, Dialog, InputText,
    CheckboxModule, ToastModule, ButtonModule, MessageModule, TitleCasePipe, ColorPicker, RatingModule, MultiSelectModule, ToggleButtonModule, SliderModule, KnobModule,
    InputTextModule, TextareaModule, InputOtpModule, InputMaskModule, ListBasicComponent, InputNumberModule 
  ],
  templateUrl: './home-form.html',
  styleUrl: './home-form.scss'
})
export class HomeForm {

  public dataIn: InputSignal<any> = input<any>();
  public dataOut: OutputEmitterRef<any> = output<any>();

  protected readonly catalogueService = inject(CatalogueService);

  private confirmationService = inject(ConfirmationService);
  protected readonly customMessageService = inject(CustomMessageService);

  protected readonly PrimeIcons = PrimeIcons;
  private readonly formBuilder = inject(FormBuilder);

  protected form!: FormGroup;

  protected houses: any[] = [];
  protected cols: ColInterface[] = [];
  protected buttonActions: MenuItem[] = [];
  protected isVisibleModal = false;
  protected index = -1;

  protected localTypes: CatalogueInterface[] = [];

  value!: number;

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
      name: [null, [Validators.required]],
      avenue: [null, [Validators.required]],
      peopleCount: [null, [Validators.required]],
      postalCode: [null, [Validators.required]],
      localType: [null, [Validators.required]]
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

    if (this.nameField.invalid) errors.push('Nombre requerido.');
    if (this.avenueField.invalid) errors.push('Avenida requerido.');
    if (this.peopleCountField.invalid) errors.push('Cantidad requerido.');
    if (this.postalCodeField.invalid) errors.push('Codigo Postal requerido.');
    if (this.localTypeField.invalid) errors.push('Tipo de local requerido.');

    return errors;
  }

  createHouse() {
    this.isVisibleModal = true;
  }

  editHouse(index: number) {
    if (index > -1) {
      this.form.patchValue(this.houses[index]);
    }
    this.isVisibleModal = true;
  }

  deleteHouse(index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure to delete?',
      header: 'Delete',
      icon: PrimeIcons.TRASH,
      rejectButtonStyleClass: 'p-button-text',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'danger',
        text: true
      },
      acceptButtonProps: {
        label: 'Yes, Delete'
      },
      accept: () => {
        this.houses.splice(index, 1);
        this.form.reset();
      },
      key: 'confirmdialog'
    });
  }

  saveHouse() {
    if (this.index < 0) {
      this.houses.push(this.form.value);
    } else {
      this.houses[this.index] = this.form.value;
    }
    this.form.reset();
  }

  buildButtonActions({ index }: { index: number }) {
    this.index = index;

    if (this.index < 0) {
      this.customMessageService.showError({ summary: 'Record does not exist', detail: 'Try again' });
      return;
    }

    this.buttonActions = [
      {
        ...editButtonAction,
        command: () => {
          this.editHouse(this.index);
        }
      },
      {
        ...deleteButtonAction,
        command: () => {
          this.deleteHouse(this.index);
        }
      }
    ];
  }

  buildColumns() {
    this.cols = [
      { header: 'Nombre', field: 'name' },
      { header: 'Avenida', field: 'avenue' },
      { header: 'Personas alojadas', field: 'peopleCount' },
      { header: 'Codigo postal', field: 'postalCode' }
    ];
  }

  validateItemForm() {
    const errors: string[] = [];

    if (this.nameField.invalid) errors.push('El nombre es Requerido.');
    if (this.avenueField.invalid) errors.push('La avenida es Requerida.');
    if (this.peopleCountField.invalid) errors.push('las Cantidad es Requerida.');
    if (this.postalCodeField.invalid) errors.push('El codigo postal es Requerido.');

    return errors;
  }

  closeModal() {
    this.isVisibleModal = false;
    this.form.reset();
  }

  onSubmit() {
    const errors = this.validateItemForm();
    if (errors.length === 0) {
      this.saveHouse();
    } else {
      this.customMessageService.showError({ summary: 'Form errors', detail: errors.join(', ') });
    }
  }

  get nameField(): AbstractControl { 
    return this.form.get('name')!; 
  }

  get avenueField(): AbstractControl { 
    return this.form.get('avenue')!; 
  }
  
  get peopleCountField(): AbstractControl { 
    return this.form.get('peopleCount')!; 
  }

  get postalCodeField(): AbstractControl { 
    return this.form.get('postalCode')!; 
  }

  get localTypeField(): AbstractControl {
    return this.form.controls['localType'];
  }
}

