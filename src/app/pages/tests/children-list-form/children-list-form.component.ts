import { Component, EventEmitter, inject, input, Input, InputSignal, OnInit, output, Output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ColInterface } from '@utils/interfaces';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { deleteButtonAction, editButtonAction } from '@utils/components/button-action/consts';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ListBasicComponent } from '@utils/components/list-basic/list-basic.component';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { dateGreaterThan } from '@utils/form-validators/custom-validator';

@Component({
    selector: 'app-children-list-form',
    imports: [Fluid, ReactiveFormsModule, DatePicker, LabelDirective, Message, ErrorMessageDirective, ToggleSwitch, TableModule, Button, Dialog, InputText, ListBasicComponent, InputNumber],
    templateUrl: './children-list-form.component.html',
    styleUrls: ['./children-list-form.component.scss']
})
export class ChildrenListFormComponent implements OnInit {
    public dataIn: InputSignal<any> = input<any>();
    public dataOut: OutputEmitterRef<any> = output<any>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private confirmationService = inject(ConfirmationService);

    protected form!: FormGroup;
    protected itemForm!: FormGroup;

    protected buttonActions: MenuItem[] = [];
    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: any[] = [];

    constructor() {}

    ngOnInit() {
        this.loadData();
        this.buildForm();
        this.buildColumns();
    }

    loadData() {}

    buildForm() {
        this.form = this.formBuilder.group({
            hasMaritimeTransport: false,
            items: []
        });

        this.itemForm = this.formBuilder.group(
            {
                id: [null],
                totalUnits: [null, [Validators.required]],
                totalSeats: [null, [Validators.required]],
                certifiedCode: [null, [Validators.required]],
                certifiedIssueAt: [null, [Validators.required]],
                certifiedExpirationAt: [null, [Validators.required]]
            },
            {
                validators: dateGreaterThan('certifiedIssueAt', 'certifiedExpirationAt')
            }
        );

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form.value);

        this.hasMaritimeTransportField.valueChanges.subscribe((value) => {
            this.itemsField.setValue(this.items);
            this.dataOut.emit(this.form.value);
        });
    }

    buildButtonActions({ item, index = -1 }: { item: any; index?: number }) {
        this.buttonActions = [
            {
                ...editButtonAction,
                command: () => {
                    if (index > -1) this.editItem(index);
                }
            },
            {
                ...deleteButtonAction,
                command: () => {
                    if (item?.certifiedCode) this.deleteItem(item.certifiedCode);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Número o Código de la Matrícula de Armador', field: 'certifiedCode' },
            { header: 'Número de unidades de transporte', field: 'totalUnits' },
            { header: 'Total, número de puesto', field: 'totalSeats' },
            { header: 'Fecha de emisión de la Matrícula de Armador', field: 'certifiedIssueAt', type: 'date' },
            { header: 'Fecha de Caducidad de la Matrícula de Armador', field: 'certifiedExpirationAt', type: 'date' }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasMaritimeTransportField.value && this.items.length === 0) errors.push('Transporte Marítimo');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    validateItemForm() {
        const errors: string[] = [];

        if (this.totalUnitsField.invalid) errors.push('Número de unidades de transporte');
        if (this.totalSeatsField.invalid) errors.push('Total, número de puesto');
        if (this.certifiedCodeField.invalid) errors.push('Número o Código de la Matrícula de Armador');
        if (this.certifiedIssueAtField.invalid) errors.push('Fecha de emisión de la Matrícula de Armador');
        if (this.certifiedExpirationAtField.invalid) errors.push('Fecha de Caducidad de la Matrícula de Armador');

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
        this.findItem(index);
        this.isVisibleModal = true;
    }

    deleteItem(index: number) {
        this.isVisibleModal = false;

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
                this.items = this.items.slice(index, 1);

                this.itemsField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    saveItem() {
        this.items.push(this.itemForm.value);

        this.closeModal();

        this.itemsField.setValue(this.items);

        this.dataOut.emit(this.form);
    }

    findItem(index: number) {
        if (index > -1) {
            this.itemForm.patchValue(this.items[index]);
        }
    }

    closeModal() {
        this.isVisibleModal = false;
        this.idField.reset();
        this.totalUnitsField.reset();
        this.totalSeatsField.reset();
        this.certifiedCodeField.reset();
        this.certifiedIssueAtField.reset();
        this.certifiedExpirationAtField.reset();
    }

    onSubmit() {
        if (this.validateItemForm()) {
            this.saveItem();
        }
    }

    get idField(): AbstractControl {
        return this.itemForm.controls['id'];
    }

    get totalUnitsField(): AbstractControl {
        return this.itemForm.controls['totalUnits'];
    }

    get totalSeatsField(): AbstractControl {
        return this.itemForm.controls['totalSeats'];
    }

    get certifiedCodeField(): AbstractControl {
        return this.itemForm.controls['certifiedCode'];
    }

    get certifiedIssueAtField(): AbstractControl {
        return this.itemForm.controls['certifiedIssueAt'];
    }

    get certifiedExpirationAtField(): AbstractControl {
        return this.itemForm.controls['certifiedExpirationAt'];
    }

    get hasMaritimeTransportField(): AbstractControl {
        return this.form.controls['hasMaritimeTransport'];
    }

    get itemsField(): AbstractControl {
        return this.form.controls['items'];
    }
}
