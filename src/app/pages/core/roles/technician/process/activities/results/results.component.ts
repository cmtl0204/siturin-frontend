import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { Status2Component } from './status2/status2.component';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueCadastresStateEnum, CatalogueTypeEnum } from '@utils/enums';
import { CatalogueInterface } from '@utils/interfaces';
import { PrimeIcons } from 'primeng/api';
import { Fluid } from 'primeng/fluid';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [Dialog, ButtonModule, Select, FormsModule, ReactiveFormsModule, LabelDirective, CommonModule, Status2Component, Fluid, ErrorMessageDirective, Message],
    templateUrl: './results.component.html',
    styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly CatalogueCadastresStateEnum = CatalogueCadastresStateEnum;
    private readonly catalogueService = inject(CatalogueService);

    protected states: CatalogueInterface[] = [];
    protected stateControl = new FormControl<CatalogueInterface>({}, [Validators.required]);
    isVisibleModal: boolean = false;

    async ngOnInit(): Promise<void> {
        await this.loadCatalogues();
    }

    async loadCatalogues() {
        this.states = await this.catalogueService.findByType(CatalogueTypeEnum.cadastre_states_state);
    }

    showDialog() {
        this.isVisibleModal = true;
    }
}
