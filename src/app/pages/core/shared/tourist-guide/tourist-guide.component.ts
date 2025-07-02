import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ColInterface, PaginationInterface } from '@utils/interfaces';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { ListComponent } from '@utils/components/list/list.component';
import { deleteButtonAction, editButtonAction, viewButtonAction } from '@utils/components/button-action/consts';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TouristGuideInterface } from '@modules/core/interfaces';
import { TouristGuideHttpService } from '@modules/core/shared/adventure-tourism-modality/tourist-guide-http.service';

@Component({
    selector: 'app-tourist-guide',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, ToggleSwitch, TableModule, Button, ListComponent, Dialog, InputText],
    templateUrl: './tourist-guide.component.html',
    styleUrl: './tourist-guide.component.scss'
})
export class TouristGuideComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly touristGuideHttpService = inject(TouristGuideHttpService);
    private confirmationService = inject(ConfirmationService);
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;
    protected buttonActions: MenuItem[] = [];
    protected pagination!: PaginationInterface;

    protected isVisibleModal = false;

    protected cols: ColInterface[] = [];
    protected items: TouristGuideInterface[] = [];

    constructor() {
        this.buildForm();
        this.buildColumns();
    }

    ngOnInit() {
        this.findTouristGuides();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            id: [null],
            hasTouristGuide: [false, [Validators.required]],
            identification: [null, [Validators.required]],
            name: [null, [Validators.required]],
            isGuide: [false, [Validators.required]],
            touristLicences: [[]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.hasTouristGuideField.valueChanges.subscribe((value) => {
            this.touristLicensesField.setValidators(Validators.required);
            this.touristLicensesField.updateValueAndValidity();
        });
    }

    buildButtonActions(item: TouristGuideInterface) {
        this.buttonActions = [
            {
                ...viewButtonAction,
                command: () => {
                    if (item?.id) this.view();
                }
            },
            {
                ...editButtonAction,
                command: () => {
                    if (item?.id) this.edit(item.id);
                }
            },
            {
                ...deleteButtonAction,
                command: () => {
                    if (item?.id) this.delete(item.id);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Número de cédula', field: 'identification' },
            { header: 'Nombre', field: 'name' }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasTouristGuideField.value && this.items.length === 0) errors.push('Guías de Turismo');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    validateForm() {
        const errors: string[] = [];

        if (this.identificationField.invalid) errors.push('Número de cédula');
        if (this.nameField.invalid) errors.push('Nombres');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    create() {
        this.idField.disable();
        this.isVisibleModal = true;
    }

    edit(id: string) {
        this.idField.enable();
        if (id) this.findTouristGuide(id);
    }

    delete(id: string) {
        this.isVisibleModal = false;

        if (id) this.deleteTouristGuide(id);
    }

    view() {
        this.isVisibleModal = true;
    }

    closeModal() {
        this.isVisibleModal = false;
        this.identificationField.reset();
        this.nameField.reset();
        this.isGuideField.reset();
    }

    onSubmit() {
        this.isGuideField.setValue(true);

        if (this.validateForm()) {
            if (this.idField.enabled) {
                this.updateTouristGuide();
            } else {
                this.createTouristGuide();
            }
        }
    }

    createTouristGuide() {
        this.isGuideField.setValue(true);

        if (this.validateForm()) {
            this.touristGuideHttpService.create(this.form.value).subscribe({
                next: (data) => {
                    this.findTouristGuides();
                    this.closeModal();
                }
            });
        }
    }

    updateTouristGuide() {
        this.isGuideField.setValue(true);

        if (this.validateForm()) {
            this.touristGuideHttpService.update(this.idField.value, this.form.value).subscribe({
                next: (data) => {
                    this.findTouristGuides();
                    this.closeModal();
                }
            });
        }
    }

    deleteTouristGuide(id: string) {
        this.isVisibleModal = false;
        console.log(id);

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
                this.touristGuideHttpService.delete(id).subscribe({
                    next: (data) => {
                        this.findTouristGuides();
                    }
                });
            },
            key: 'confirmdialog'
        });
    }

    findTouristGuides(page = 1) {
        this.touristGuideHttpService.findAll(page).subscribe({
            next: (response) => {
                this.items = response.data;
                this.pagination = response.pagination!;
            }
        });
    }

    findTouristGuide(id: string) {
        this.touristGuideHttpService.findOne(id).subscribe({
            next: (data: TouristGuideInterface) => {
                this.form.patchValue(data);
                this.isVisibleModal = true;
            }
        });
    }

    get idField(): AbstractControl {
        return this.form.controls['id'];
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

    get touristLicensesField(): FormArray {
        return this.form.controls['touristLicences'] as FormArray;
    }
}
