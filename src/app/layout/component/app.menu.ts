import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MY_ROUTES } from '@routes';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '@modules/auth/auth.service';
import { RoleEnum } from '@utils/enums';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, Ripple],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
        <div class="mt-auto">
            <hr class="mb-4 mx-4 border-t border-0 border-surface" />

            <a (click)="signOut()" pRipple class="m-4 flex items-center cursor-pointer p-4 gap-2 rounded-border text-surface-700 dark:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors p-ripple">
                <i [class]="PrimeIcons.POWER_OFF" style="color:red "></i>
                <span class="font-bold" style="color: red"> Cerrar Sesión </span>
            </a>
        </div>
    `
})
export class AppMenu implements OnInit {
    private readonly _router = inject(Router);
    protected readonly authService = inject(AuthService);
    protected readonly PrimeIcons = PrimeIcons;
    protected model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'MINTUR',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    ...this.loadMenu,
                    {
                        label: this.authService.auth.username,
                        icon: PrimeIcons.USER,
                        routerLink: [MY_ROUTES.corePages.dac.program.list.absolute]
                    }
                ]
            }
        ];
    }

    signOut() {
        this.authService.removeLogin();
    }

    get loadMenu(): MenuItem[] {
        switch (this.authService.role.code) {
            case RoleEnum.EXTERNAL:
                return this.externalMenu;
            case RoleEnum.GAD:
                return this.gadMenu;
            case RoleEnum.DAC:
                return this.dacMenu;
            case RoleEnum.SPECIALIST:
                return this.specialistMenu;
            case RoleEnum.TECHNICIAN:
                return this.technicianMenu;
            default:
                return [];
        }
    }

    get externalMenu(): MenuItem[] {
        return [
            {
                label: 'Simulador Normativa',
                icon: PrimeIcons.DESKTOP,
                routerLink: [MY_ROUTES.corePages.shared.simulator.absolute]
            },
            {
                label: 'Proceso de Acreditación de Actividades Turísticas',
                icon: PrimeIcons.LIST_CHECK,
                routerLink: [MY_ROUTES.corePages.external.accreditation.absolute]
            },
            {
                label: 'Manuales de Usuario',
                icon: PrimeIcons.BOOK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            }
        ];
    }

    get gadMenu(): MenuItem[] {
        return [
            {
                label: 'Simulador Normativa',
                icon: PrimeIcons.DESKTOP,
                routerLink: [MY_ROUTES.corePages.dac.program.list.absolute]
            },
            {
                label: 'Catastro Turístico (GAD)',
                icon: PrimeIcons.LIST_CHECK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Bitácora',
                icon: PrimeIcons.HISTORY,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Manuales de Usuario',
                icon: PrimeIcons.BOOK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            }
        ];
    }

    get dacMenu(): MenuItem[] {
        return [
            {
                label: 'Simulador Normativa',
                icon: PrimeIcons.DESKTOP,
                routerLink: [MY_ROUTES.corePages.dac.program.list.absolute]
            },
            {
                label: 'Catastro Turístico (DAC)',
                icon: PrimeIcons.LIST_CHECK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Bitácora',
                icon: PrimeIcons.HISTORY,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Manuales de Usuario',
                icon: PrimeIcons.BOOK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            }
        ];
    }

    get technicianMenu(): MenuItem[] {
        return [
            {
                label: 'Simulador Normativa',
                icon: PrimeIcons.DESKTOP,
                routerLink: [MY_ROUTES.corePages.dac.program.list.absolute]
            },
            {
                label: 'Técnico Zonal',
                icon: PrimeIcons.LIST,
                routerLink: [MY_ROUTES.corePages.technician.process.absolute]
            },
            {
                label: 'Catastro Turístico',
                icon: PrimeIcons.LIST_CHECK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Bitácora',
                icon: PrimeIcons.HISTORY,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Manuales de Usuario',
                icon: PrimeIcons.BOOK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            }
        ];
    }

    get specialistMenu(): MenuItem[] {
        return [
            {
                label: 'Simulador Normativa',
                icon: PrimeIcons.DESKTOP,
                routerLink: [MY_ROUTES.corePages.dac.program.list.absolute]
            },
            {
                label: 'Especialista Zonal',
                icon: PrimeIcons.LIST,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Catastro Turístico',
                icon: PrimeIcons.LIST_CHECK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Bitácora',
                icon: PrimeIcons.HISTORY,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            },
            {
                label: 'Manuales de Usuario',
                icon: PrimeIcons.BOOK,
                routerLink: [MY_ROUTES.corePages.dac.project.list.absolute]
            }
        ];
    }
}
