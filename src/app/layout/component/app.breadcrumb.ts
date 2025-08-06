import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { environment } from '@env/environment';
import { Breadcrumb } from 'primeng/breadcrumb';
import { BreadcrumbService } from '../service/breadcrumb.service';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, Breadcrumb],
    template: ` <p-breadcrumb class="max-w-full" [model]="breadcrumbService.items()" [home]="home" /> `
})
export class AppBreadcrumb implements OnInit {
    protected readonly breadcrumbService = inject(BreadcrumbService);
    home!: MenuItem;

    ngOnInit() {
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
}
