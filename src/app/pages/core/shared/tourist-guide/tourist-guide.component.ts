import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-tourist-guide',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch, TableModule, IconField, InputIcon, Button, Tooltip, ButtonActionComponent, ListComponent, Dialog, InputText],
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

    protected isVisibleModal = false;

    protected items: CatalogueInterface[] = [
        { id: '1', name: 'Casa', parent: { name: 'Juan' }, createdAt: new Date('2025-01-02') },
        { id: '2', name: 'Edificio', parent: { name: 'Juan' }, createdAt: new Date('2025-01-02') }
    ];

    protected cols: ColInterface[] = [
        { header: 'ID', field: 'id' },
        { header: 'Nombre', field: 'name' },
        { header: 'Padre', field: 'parent', type: 'object', objectName: 'name' },
        { header: 'Fecha', field: 'createdAt', type: 'date' }
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
            identification: [null, [Validators.required]],
            name: [null, [Validators.required]],
            isGuide: [false, [Validators.required]],
            licenses: [[]]
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
            }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.identificationField.invalid) errors.push('Número de cédula');
        if (this.nameField.invalid) errors.push('Nombres');
        if (this.isGuideField.invalid) errors.push('Al momento de la inspección se presentará la licencia única de funcionamiento');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    validateForm(){
        const errors: string[] = [];

        if (this.identificationField.invalid) errors.push('Número de cédula');
        if (this.nameField.invalid) errors.push('Nombres');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this._customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    find() {}

    create() {
        this.isVisibleModal = true;
    }

    closeModal() {
        this.isVisibleModal = false;
        this.identificationField.reset();
        this.nameField.reset();
        this.isGuideField.reset();
    }

    addTouristGuide() {
        if (this.validateForm()) {
            this.items.push(this.form.value);
            this.closeModal();
        }
    }

    get hasTouristGuideField(): AbstractControl {
        return this.form.controls['hasTouristGuide'];
    }

    get identificationField(): AbstractControl {
        return this.form.controls['identification'];
    }

    get nameField(): AbstractControl {
        return this.form.controls['name'];
    }

    get isGuideField(): AbstractControl {
        return this.form.controls['isGuide'];
    }

    get licensesField(): FormArray {
        return this.form.controls['licenses'] as FormArray;
    }
}
