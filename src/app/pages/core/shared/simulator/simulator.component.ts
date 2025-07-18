import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Fluid } from 'primeng/fluid';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Divider } from 'primeng/divider';
import { PrimeIcons } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';
import { BreadcrumbService } from '@layout/service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { format } from 'date-fns';

@Component({
    selector: 'app-simulator',
    imports: [AutoCompleteModule, ReactiveFormsModule, Fluid, Card, Button, Select, Divider, Tooltip],
    templateUrl: './simulator.component.html',
    styleUrl: './simulator.component.scss'
})
export class SimulatorComponent {
    private readonly httpClient = inject(HttpClient);
    private readonly breadcrumbService = inject(BreadcrumbService);
    protected readonly PrimeIcons = PrimeIcons;
    protected contacts: any[] = [];
    protected categories: any[] = ['Inversión', 'Promoción', 'Emprendedores', 'Empresarios'];
    protected contactsClone: any[] = [];
    protected category: FormControl = new FormControl();
    protected search: FormControl = new FormControl({ value: null, disabled: true });

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Contactos' }]);
        this.getContacts();

        this.category.valueChanges.subscribe((value) => {
            if (value) {
                this.search.enable();
            }
            this.filterContacts(value);
        });
    }

    filterContacts(filterValue: string) {
        this.contacts = this.contactsClone.filter((contact) => contact.category === filterValue);
    }

    getContacts() {
        this.httpClient.get(`${environment.API_URL}/core/shared/google`).subscribe({
            next: (response: any) => {
                console.log(response.data);
                this.contacts = [];

                const data = response.data;
                const contactsTemp = [];
                for (let i = 1; i < response.data.length; i++) {
                    contactsTemp.push({
                        category: data[i][0],
                        company: data[i][1],
                        name: data[i][2],
                        lastname: data[i][3],
                        email: data[i][4],
                        phone: data[i][5],
                        secondaryPhone: data[i][6],
                        address: data[i][7],
                        notes: data[i][8],
                        attachment: data[i][9]
                    });
                }

                this.contacts = contactsTemp;
                this.contactsClone = contactsTemp;
                console.log(this.contacts);
            }
        });
    }

    downloadAttachment(url: string): void {
        window.open(url, '_blank');
    }

    downloadReport(): void {
        const data = this.contactsClone.map((contact) => {
            return {
                'Nombre Contacto': contact.name
            };
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
            Sheets: { Datos: worksheet },
            SheetNames: ['Datos']
        };

        const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        const blob: Blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const fileName = `reporte_contactos_${format(new Date(), 'yyyy_MM_dd_HH_mm_ss')}.xlsx`;
        FileSaver.saveAs(blob, fileName);
    }
}
