import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CustomMessageService } from '@utils/services';
import { CatalogueInterface } from '@utils/interfaces';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueTypeEnum } from '@utils/enums';

@Component({
    selector: 'app-juridical-person',
    imports: [Fluid, LabelDirective, ReactiveFormsModule, Select, ToggleSwitch, Message, ErrorMessageDirective],
    templateUrl: './juridical-person.component.html',
    styleUrl: './juridical-person.component.scss'
})
export class JuridicalPersonComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly catalogueService = inject(CatalogueService);

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected legalEntities: CatalogueInterface[] = [];

    ngOnInit() {
        this.buildForm();
        this.loadCatalogues();
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            legalEntity: [null],
            hasPersonDesignation: [false],
            hasTouristActivityDocument: [false]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.subscribe(() => {
            this.dataOut.emit(this.form);
        });
    }

    loadData() {
        if (this.data) {
            try {
                const parsedData = JSON.parse(this.data);
                this.form.patchValue(parsedData);
            } catch (error) {
                console.error('Error parsing data:', error);
            }
        }
    }

    async loadCatalogues() {
    this.legalEntities = await this.catalogueService.findByType(CatalogueTypeEnum.processes_legal_entity)
    }

    get legalEntityField(): AbstractControl {
        return this.form.get('legalEntity')!;
    }

    get hasPersonDesignationField(): AbstractControl {
        return this.form.get('hasPersonDesignation')!;
    }

    get hasTouristActivityDocumentField(): AbstractControl {
        return this.form.get('hasTouristActivityDocument')!;
    }
}
