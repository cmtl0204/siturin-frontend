import { Component, OnInit, inject, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { Message } from 'primeng/message';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { CatalogueInterface } from '@/utils/interfaces';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-air',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, SelectModule, Message, LabelDirective, ErrorMessageDirective, ToggleSwitchModule, InputTextModule, DatePickerModule, NgIf],
    templateUrl: './air.component.html',
    styleUrl: './air.component.scss'
})
export class AirComponent implements OnInit {
    protected readonly formBuilder = inject(FormBuilder);
    private readonly catalogueService = inject(CatalogueService);

    @Input() isAirTransport = false;
    @Input() subClassification: string | undefined;

    @Output() dataOut = new EventEmitter<FormGroup>();

    protected form!: FormGroup;
    protected aerolinea_tipos: CatalogueInterface[] = [];

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadCatalogues();

        if (this.subClassification === 'Aerolínea') {
            this.airlineTypeField.setValidators([Validators.required]);
            this.airlineTypeField.updateValueAndValidity();
        }
    }

    async loadCatalogues() {
        this.aerolinea_tipos = await this.catalogueService.findByType(CatalogueTypeEnum.aerolinea_tipos);
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            airlineType: [null],
            localType: [null, Validators.required],
            certifiedCode: [null, Validators.required],
            certified: [false, Validators.required],
            certifiedIssueAt: [null, Validators.required],
            certifiedExpirationAt: [null, Validators.required]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.airlineTypeField.valueChanges.subscribe((value: any) => {
            if (value && this.subClassification === 'Aerolínea') {
                this.localTypeField.setValidators([Validators.required]);
            } else {
                this.localTypeField.clearValidators();
                this.localTypeField.setValue(null);
            }
            this.localTypeField.updateValueAndValidity();
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }

        if (this.subClassification === 'Aerolínea' && this.airlineTypeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Aerolínea.');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    get airlineTypeField(): AbstractControl {
        return this.form.controls['airlineType'];
    }

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get certifiedCodeField(): AbstractControl {
        return this.form.controls['certifiedCode'];
    }

    get certifiedField(): AbstractControl {
        return this.form.controls['certified'];
    }

    get certifiedIssueAtField(): AbstractControl {
        return this.form.controls['certifiedIssueAt'];
    }

    get certifiedExpirationAtField(): AbstractControl {
        return this.form.controls['certifiedExpirationAt'];
    }

    protected readonly Validators = Validators;
}
