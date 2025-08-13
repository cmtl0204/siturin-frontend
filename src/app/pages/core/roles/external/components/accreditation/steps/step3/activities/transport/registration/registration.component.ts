import { Component, effect, inject, QueryList, ViewChildren } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { CommonModule } from '@angular/common';

import { ClassificationInterface } from '@modules/core/shared/interfaces';
import { AirComponent } from '../shared/air/air.component';
import { LandComponent } from '../shared/land/land.component';
import { MaritimeComponent } from '../shared/maritime/maritime.component';
import { AprotectecComponent } from '../shared/aprotectec/aprotectec.component';
import { CatalogueTransportClassificationsCodeEnum } from '@/pages/core/shared/components/regulation-simulator/enum';

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [CommonModule, Button, AirComponent, LandComponent, MaritimeComponent, AprotectecComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    protected readonly PrimeIcons = PrimeIcons;

    // Referencias a componentes hijos para validaciones
    @ViewChildren(AprotectecComponent) private aprotectecComponent!: QueryList<AprotectecComponent>;
    @ViewChildren(AirComponent) private airComponent!: QueryList<AirComponent>;
    @ViewChildren(LandComponent) private landComponent!: QueryList<LandComponent>;
    @ViewChildren(MaritimeComponent) private maritimeComponent!: QueryList<MaritimeComponent>;

    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;
    protected currentClassification!: ClassificationInterface | undefined;

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);

    // Getter para decidir cuándo mostrar los otros componentes
    protected get shouldShowTransportType(): boolean {
        return ['Aereo', 'Terrestre', 'Maritimo', 'Aprotectec'].includes(this.currentClassification?.name ?? '');
    }

    constructor() {
        // Inicializamos el form principal
        this.mainForm = this.formBuilder.group({});

        // Reactivo: carga datos de sessionStorage
        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                this.currentClassification = processSignal.classification;
            }
        });
    }

    // Recibe formulario hijo y lo integra al principal
    saveForm(childForm: FormGroup) {
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    onSubmit() {
        console.log(this.mainForm.value);
        if (!this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        console.log('Procesando datos:', this.mainForm.value);
        // Aquí la lógica de guardado en backend
    }

    checkFormErrors(): boolean {
        const errors: string[] = [
            ...this.aprotectecComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.airComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.landComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.maritimeComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return true; // Hay errores
        }

        return false; // Sin errores
    }

    protected readonly CatalogueTransportClassificationsCodeEnum = CatalogueTransportClassificationsCodeEnum;
}
