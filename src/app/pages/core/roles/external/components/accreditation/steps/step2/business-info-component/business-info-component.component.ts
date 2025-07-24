import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';
import { EstablishmentInterface } from '@modules/core/shared/interfaces';

@Component({
    selector: 'app-business-info-component',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, InputText, ErrorMessageDirective, Message],
    templateUrl: './business-info-component.component.html',
    styleUrl: './business-info-component.component.scss'
})
export class BusinessInfoComponent implements OnInit {
    @Input() data!: EstablishmentInterface;
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);

    protected form!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            tradeName: [null],
            webPage: [null]
        });

        this.tradeNameField.disable();

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            this.dataOut.emit(this.form);
        });
    }

    loadData() {
        if (this.data) {
            this.form.patchValue(this.data);
        }
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.webPageField.invalid) {
            errors.push('Dirección URL de la Página WEB');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    get tradeNameField(): AbstractControl {
        return this.form.controls['tradeName'];
    }

    get webPageField(): AbstractControl {
        return this.form.controls['webPage'];
    }
}
