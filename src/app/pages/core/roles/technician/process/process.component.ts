import { Component, QueryList, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { DownloadDocumentsComponent } from "./activities/download-documents/download-documents.component";
import { ScheduleComponent } from "./activities/schedule/schedule.component";
import { ResultsComponent } from "./activities/results/results.component";
import { PrimeIcons } from 'primeng/api';
import { Message } from 'primeng/message';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-process',
    imports: [TableModule, ButtonModule, DividerModule, PanelModule, DownloadDocumentsComponent, ScheduleComponent, ResultsComponent, Message, Fluid],
    templateUrl: './process.component.html',
    styleUrl: './process.component.scss'
})
export class ProcessComponent {
    @ViewChildren(DownloadDocumentsComponent) private downloadDocumentsComponent!: QueryList<DownloadDocumentsComponent>;

    products = [
        { code: 'P1001', name: 'Laptop', category: 'Electronics', quantity: 10 },
        { code: 'P1002', name: 'Phone', category: 'Electronics', quantity: 25 },
        { code: 'P1003', name: 'Desk', category: 'Furniture', quantity: 5 },
        { code: 'P1004', name: 'Chair', category: 'Furniture', quantity: 12 },
        { code: 'P1005', name: 'Notebook', category: 'Stationery', quantity: 100 }
    ];

    protected readonly PrimeIcons = PrimeIcons;
}
