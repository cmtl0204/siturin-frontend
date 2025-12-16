import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { format } from 'date-fns';
import { Button } from 'primeng/button';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { Fluid } from 'primeng/fluid';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { CoreService } from '@utils/services';
import { ColInterface } from '@utils/interfaces/col.interface';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-list-basic',
    templateUrl: './list-basic.component.html',
    styleUrls: ['./list-basic.component.scss'],
    imports: [Button, ButtonActionComponent, Fluid, IconField, InputIcon, ReactiveFormsModule, TableModule, Tooltip, InputText, DatePipe],
    standalone: true
})
export class ListBasicComponent {
    @Input() items: any[] = [];
    @Input() cols: ColInterface[] = [];
    @Input() buttonActions: MenuItem[] = [];
    @Input() enabled: boolean = false;
    @Input() title!: string;
    @Input() isButtonActionsEnabled = false;
    @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEdit: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly coreService = inject(CoreService);
    protected selectedItem = new EventEmitter<any>();
    protected searchControl: FormControl = new FormControl(null);
    protected currentYear: string;

    constructor() {
        this.currentYear = format(new Date(), 'yyyy');

        this.checkValueChanges();
    }

    checkValueChanges() {}

    selectItem(item: any, index: number) {
        this.isButtonActionsEnabled = true;
        this.selectedItem = item;
        this.onSelect.emit({ item, index });
    }

    create() {
        this.onCreate.emit();
    }
}
