import { Component, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '../service/layout.service';
import { Divider } from 'primeng/divider';
import { Fluid } from 'primeng/fluid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { environment } from '@env/environment';
import { PrimeIcons } from 'primeng/api';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, Divider, Fluid, FormsModule, Message, ReactiveFormsModule],
    template: `
        <p-fluid>
            <div class="flex flex-col md:flex-row gap-8 mt-6">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div class="card h-full flex flex-col lg:col-start-2 lg:col-span-4 md:col-start-1 md:col-span-6 gap-4">
                        <img [src]="environment.PATH_ASSETS + '/images/auth/logo.png'" alt="" class="mx-auto" />

                        <p-message>
                            <ng-template #icon>
                                <p class="text-lg font-semibold text-center">Si usted tiene inconvenientes para ingresar al sistema, comuníquese con el Ministerio de Turismo</p>
                            </ng-template>
                        </p-message>

                        <p-divider />

                        <router-outlet />

                        <img [src]="environment.PATH_ASSETS + '/images/auth/footer.png'" alt="" class="mx-auto" />
                    </div>

                    <div class="card h-full flex flex-col lg:col-start-6 lg:col-span-6 md:col-start-7 md:col-span-6 gap-4">
                        <div class="font-semibold text-xl text-center">SISTEMA DE TURISMO INTELIGENTE</div>

                        <p-message>
                            <div class="text-sm font-semibold">
                                <p>
                                    <b>Importante:</b>
                                    Estimado Usuario, si su establecimiento se encuentra ubicado en el cantón Quito, por favor acérquese a las oficinas de "Quito Turismo" para solicitar su Certificado de Registro Turístico.
                                </p>
                                <p><b>Dirección:</b> Parque Bicentenario, terminales del antiguo Aeropuerto de Quito.</p>
                                <p><b>Teléfono:</b> (02) 2993 300 extensiones 1003, 1035 y 1068</p>
                                <p>
                                    <b>Correo electrónico:</b>
                                    <a href="mailto:info@quito-turismo.gob.ec"> info&#64;quito-turismo.gob.ec</a>
                                </p>
                            </div>
                        </p-message>

                        <p-divider />

                        <div class="flex flex-col gap-2">
                            <a target="_blank" [href]="environment.PATH_ASSETS + '/files/auth/steps.pdf'">
                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-2 flex flex-col gap-2">
                                        <!--                                    <img-->
                                        <!--                                        [src]="environment.PATH_ASSETS+'/images/auth/cinco_pasos.svg'"-->
                                        <!--                                        alt="cabecera">-->
                                        <i [class]="PrimeIcons.LIST_CHECK" style="font-size: 3rem;color:var(--primary-color)"></i>
                                    </div>
                                    <div class="md:col-span-10 flex flex-col gap-2">
                                        <h6 class="mb-5" style="color: #01579B">5 PASOS PARA OBTENER UN REGISTRO DE TURISMO</h6>
                                        <p>Pasos para obtener un certificado de Registro de Turismo.</p>
                                    </div>
                                </div>
                            </a>
                            <br />

                            <a target="_blank" [routerLink]="['/simulador-externo']">
                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-2 flex flex-col gap-2">
                                        <!--                                    <img [src]="environment.PATH_ASSETS+'/images/auth/simulador_normativa.svg'"-->
                                        <!--                                         alt="cabecera">-->
                                        <i [class]="PrimeIcons.DESKTOP" style="font-size: 3rem;color:var(--primary-color)"></i>
                                    </div>
                                    <div class="md:col-span-10 flex flex-col gap-2">
                                        <h6 class="mb-5" style="color: #01579B">SIMULADOR DE NORMATIVA</h6>
                                        <p>Permite validar si se cumple o no con los requisitos para acceder a una clasificación y categoría específica.</p>
                                    </div>
                                </div>
                            </a>
                            <br />

                            <a target="_blank" [href]="environment.PATH_ASSETS + '/files/auth/external_manual.pdf'">
                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-2 flex flex-col gap-2">
                                        <!--                                    <img [src]="environment.PATH_ASSETS+'/images/auth/manual_usuario.svg'"-->
                                        <!--                                         alt="cabecera">-->

                                        <i [class]="PrimeIcons.BOOK" style="font-size: 3rem;color:var(--primary-color)"></i>
                                    </div>
                                    <div class="md:col-span-10 flex flex-col gap-2">
                                        <h6 class="mb-5" style="color: #01579B">MANUAL</h6>
                                        <p>Manual de usuario del Sistema de Turismo Inteligente - SITURIN.</p>
                                    </div>
                                </div>
                            </a>
                            <br />

                            <a target="_blank" [href]="environment.PATH_ASSETS + '/files/auth/terms_conditions.pdf'">
                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-2 flex flex-col gap-2">
                                        <!--                                    <img [src]="environment.PATH_ASSETS+'/images/auth/terminos_condiciones.svg'"-->
                                        <!--                                         alt="cabecera">-->
                                        <i [class]="PrimeIcons.VERIFIED" style="font-size: 3rem;color:var(--primary-color)"></i>
                                    </div>
                                    <div class="md:col-span-10 flex flex-col gap-2">
                                        <h6 class="mb-5" style="color: #01579B">TÉRMINOS Y CONDICIONES</h6>
                                        <p>Términos y Condiciones del Sistema de Turismo Inteligente - SITURIN.</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </p-fluid>
    `
})
export class AppLayoutAuth {
    protected readonly environment = environment;

    protected readonly PrimeIcons = PrimeIcons;

    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
