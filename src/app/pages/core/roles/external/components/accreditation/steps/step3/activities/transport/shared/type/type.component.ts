import { Component, OnInit, inject, Output, EventEmitter, OutputEmitterRef, InputSignal, input, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { CatalogueInterface } from '@/utils/interfaces';
import { CatalogueTypeEnum } from '@/utils/enums';

@Component({
  selector: 'app-type',
  standalone: true,
  imports: [
    Fluid,
    ReactiveFormsModule,
    Select,
    Message,
    LabelDirective,
    ErrorMessageDirective
  ],
  templateUrl: './type.component.html',
  styleUrl: './type.component.scss'
})
export class TypeComponent implements OnInit {

  public dataIn: InputSignal<any> = input<any>();
  public dataOut: OutputEmitterRef<any> = output<any>();
  
  

  protected form!: FormGroup;
  protected readonly formBuilder = inject(FormBuilder);

  protected transporte_tipo_locales: CatalogueInterface[] = [];
  private readonly catalogueService = inject(CatalogueService);
 
     
     async loadCatalogues() {
         this.transporte_tipo_locales = await this.catalogueService.findByType(CatalogueTypeEnum.transporte_tipo_locales);
     }

  ngOnInit(): void {
    this.buildForm();
    this.watchFormChanges();
    this.loadData();

  }

  constructor() {
        this.buildForm();
    }

  buildForm(): void {
    this.form = this.formBuilder.group({
      localType: [null, Validators.required]
    });
  }

  watchFormChanges(): void {
    this.form.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        if (this.getFormErrors().length === 0) {
          this.dataOut.emit(this.form.value);
        }
      });
  }

  loadData() {
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn());
        }
    }

  get localTypeField(): AbstractControl {
    return this.form.controls['localType'];
  }

  getFormErrors(): string[] {
    const errors: string[] = [];

    if (this.localTypeField.invalid) {
      errors.push('Debe seleccionar un Tipo de Local.');
    }

    if (errors.length > 0) {
      this.form.markAllAsTouched();
    }

    return errors;
  }
}
