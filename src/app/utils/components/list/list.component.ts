import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { LabelButtonActionEnum } from '@utils/enums';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { format } from 'date-fns';
import { Button } from 'primeng/button';
import { PaginatorInterface } from '@utils/interfaces';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { Fluid } from 'primeng/fluid';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { CoreService } from '@utils/services';
import { ColInterface } from '@utils/interfaces/col.interface';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    imports: [Button, ButtonActionComponent, Fluid, IconField, InputIcon, ReactiveFormsModule, TableModule, Tooltip, InputText, Paginator],
    standalone: true
})
export class ListComponent {
    @Input() items: any[] = [];
    @Input() cols: ColInterface[] = [];
    @Input() buttonActions: MenuItem[] = [];
    @Input() enabled: boolean = false;
    @Input() title!: string;
    @Input() isButtonActionsEnabled = false;
    @Input() paginator!: PaginatorInterface;
    @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEdit: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output() onPaginator: EventEmitter<PaginatorState> = new EventEmitter<PaginatorState>();
    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly coreService = inject(CoreService);
    protected paginatorInterface!: PaginatorInterface;
    protected selectedItem = new EventEmitter<any>();
    protected searchControl: FormControl = new FormControl(null);
    protected currentYear: string;

    constructor() {
        this.paginatorInterface = this.coreService.paginator;

        this.currentYear = format(new Date(), 'yyyy');

        this.checkValueChanges();
    }

    checkValueChanges() {
        this.searchControl.valueChanges.subscribe((value) => {
            this.search(value);
        });
    }

    selectItem(item: any) {
        this.isButtonActionsEnabled = true;
        this.selectedItem = item;
        this.onSelect.emit(item);
    }

    create() {
        this.onCreate.emit();
    }

    edit() {
        this.onEdit.emit();
    }

    delete() {
        this.onDelete.emit();
    }

    search(value: string) {
        this.onSearch.emit(value);
    }

    onPageChange(event: PaginatorState) {
        this.onPaginator.emit(event);
    }
}
