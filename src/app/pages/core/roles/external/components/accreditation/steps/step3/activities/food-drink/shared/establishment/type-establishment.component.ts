import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { InputText } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { CatalogueActivitiesCodeEnum, CatalogueProcessFoodDrinksEstablishmentTypeEnum, CatalogueTypeEnum } from '@/utils/enums';

@Component({
    selector: 'app-type-establishment',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch, InputText, CommonModule],
    templateUrl: './type-establishment.component.html',
    styleUrl: './type-establishment.component.scss'
})
export class TypeEstablishmentComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly catalogueService = inject(CatalogueService);

    protected readonly CatalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum;

    protected form!: FormGroup;

    protected establishmentType: CatalogueInterface[] = [];

    constructor() {
        this.buildForm();
    }

    async ngOnInit() {
        await this.loadCatalogues();
        await this.watchFormChanges();
        await this.loadData();
    }

    onSubmit() {
        console.log(this.form.value);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            establishmentType: [null, [Validators.required]],
            establishmentName: [null,],
            hasFranchiseGrantCertificate: [false, [Validators.requiredTrue]]
        });

        this.watchFormChanges();
    }

    async watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.establishmentTypeField.valueChanges.subscribe((value) => {
            
            
            if (value.code === CatalogueProcessFoodDrinksEstablishmentTypeEnum.cadena) {
                this.hasFranchiseGrantCertificateField.clearValidators();
                this.establishmentNameField.setValidators([Validators.required]);
            }

            if (value.code === CatalogueProcessFoodDrinksEstablishmentTypeEnum.franquicia) {            
                this.hasFranchiseGrantCertificateField.setValidators([Validators.required]);
                this.establishmentNameField.setValidators([Validators.required]);
            }

            if (value.code === CatalogueProcessFoodDrinksEstablishmentTypeEnum.ninguno) {
                this.hasFranchiseGrantCertificateField.setValidators([Validators.required]);
                this.hasFranchiseGrantCertificateField.clearValidators();
                this.establishmentNameField.clearValidators();
            }

            this.hasFranchiseGrantCertificateField.updateValueAndValidity();
            this.establishmentNameField.updateValueAndValidity();
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.establishmentTypeField.invalid) errors.push('Tipo de Establecimiento');
        if (this.establishmentNameField.invalid) errors.push('Nombre de la Franquicia o Cadena');
        if (this.hasFranchiseGrantCertificateField.invalid) errors.push('Certificación de concesión de la franquicia');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    async loadCatalogues() {
        this.establishmentType = await this.catalogueService.findByType(CatalogueTypeEnum.activities_type_establishments);
    }

    loadData() {}

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
