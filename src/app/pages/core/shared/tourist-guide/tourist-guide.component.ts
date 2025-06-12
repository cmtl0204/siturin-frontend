import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface, ColInterface, PaginatorInterface } from '@utils/interfaces';
import { TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { ListComponent } from '@utils/components/list/list.component';
import { viewButtonAction } from '@utils/components/button-action/consts';

@Component({
    selector: 'app-tourist-guide',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch, TableModule, IconField, InputIcon, Button, Tooltip, ButtonActionComponent, ListComponent],
    templateUrl: './tourist-guide.component.html',
    styleUrl: './tourist-guide.component.scss'
})
export class TouristGuideComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    private readonly _formBuilder = inject(FormBuilder);
    protected readonly _customMessageService = inject(CustomMessageService);
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;
    protected buttonActions: MenuItem[] = [];
    protected paginator!: PaginatorInterface;

    protected items: CatalogueInterface[] = [
        { id: '1', name: 'Casa' },
        {
            id: '2',
            name: 'Edificio'
        }
    ];

    protected cols: ColInterface[] = [
        { header: '1', field: 'ID' },
        { header: '2', field: 'Nombre' }
    ];

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.find();
    }

    buildForm() {
        this.form = this._formBuilder.group({
            hasTouristGuide: [false, [Validators.required]],
            permanentPhysicalSpace: [null, [Validators.required]],
            isProtectedArea: [false, [Validators.required]],
            hasProtectedAreaContract: [false, [Validators.required]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
    }

    buildButtonActions(item: any) {
        this.buttonActions = [
            {
                ...viewButtonAction,
                command: () => {
                    // if (this.selectedItem?.id) this.redirectViewProject(this.selectedItem.id);
                }
            },
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.permanentPhysicalSpaceField.invalid) errors.push('Espacio físico Permanente');
        if (this.isProtectedAreaField.invalid)
            errors.push(
                '¿Realiza actividades autorizadas por la Autoridad Ambiental Nacional en el Subsistema Estatal del Sistema de Áreas Naturales Protegidas, de conformidad con lo establecido en los artículos 8 y 9 de la Ley de Turismo dentro del Subsistema Estatal del Sistema Nacional de Áreas Protegidas?'
            );
        if (this.hasProtectedAreaContractField.invalid) errors.push('Al momento de la inspección se presentará la licencia única de funcionamiento');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    find() {}

    get hasTouristGuideField(): AbstractControl {
        return this.form.controls['hasTouristGuide'];
    }

    get permanentPhysicalSpaceField(): AbstractControl {
        return this.form.controls['permanentPhysicalSpace'];
    }

    get isProtectedAreaField(): AbstractControl {
        return this.form.controls['isProtectedArea'];
    }

    get hasProtectedAreaContractField(): AbstractControl {
        return this.form.controls['hasProtectedAreaContract'];
    }
}
