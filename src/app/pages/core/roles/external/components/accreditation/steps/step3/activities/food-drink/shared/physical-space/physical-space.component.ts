import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { CommonModule } from '@angular/common';
import { Divider } from 'primeng/divider';
import { ClassificationService } from '../services/classification.service';
import { OnDestroy } from '@angular/core';

@Component({
    selector: 'app-physical-space',
    standalone: true,
    imports: [Fluid, CommonModule, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch, Divider],
    templateUrl: './physical-space.component.html',
    styleUrl: './physical-space.component.scss'
})
export class PhysicalSpaceComponent implements OnInit, OnDestroy {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly classificationService = inject(ClassificationService);
    protected form!: FormGroup;

    protected localTypes: CatalogueInterface[] = [
        { name: 'Arrendado', code: '1' },
        { name: 'Cedido', code: '2' },
        { name: 'Propio', code: '3' }
    ]
    protected permanentPhysicalSpaces: CatalogueInterface[] = [
        { id: '1', name: 'Casa' },
        {
            id: '2',
            name: 'Edificio'
        }
    ];
    private subscription!: Subscription;
    protected currentClassification!: CatalogueInterface | null;
        
    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
        this.subscription = this.classificationService.currentClassification.subscribe(
            classification => {
              this.currentClassification = classification;
              console.log('Classification updated:', this.currentClassification);
            }
          );
        // Disable landUse control¿
        
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }

    buildForm() {
        this.form = this.formBuilder.group({
            localType: [null, [Validators.required]],
            landUse: [false, [Validators.requiredTrue]],
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
            this.dataOut.emit(this.form);
            }
        });     
        
        this.form.get('localType')?.valueChanges.subscribe(() => {
            this.dataOut.emit(this.form);
        });
        // disable landUse control
//        this.landUseField.disable();        
        this.form.get('landUse')?.valueChanges.subscribe(() => {
            this.dataOut.emit(this.form);
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) errors.push('Su local es');
        if (this.landUseField.invalid) errors.push('Al momento de la inspección se presentará el Certificado de Informe de compatibilidad de uso de suelo');        

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get landUseField(): AbstractControl {
        return this.form.controls['landUse'];
    }
}
