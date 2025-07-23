import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-juridical-person',
    imports: [],
    templateUrl: './juridical-person.component.html',
    styleUrl: './juridical-person.component.scss'
})
export class JuridicalPersonComponent implements OnInit {
    establecimiento: any = {};
    tramite: string = '';
    numeroRegistro: string = '';

    // Stepper variables
    pasoActual: number = 1;
    totalPasos: number = 3;
    puedeAvanzar: boolean = false;

    // Estados de completado de cada paso
    pasosCompletados: boolean[] = [false, false, false];

    // Variables temporales para el demo
    tipoPersoneria: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.obtenerDatosEstablecimiento();

        // Inicializar datos por defecto si no vienen de navegación
        if (!this.establecimiento.id) {
            this.establecimiento = {
                id: '5',
                nombre: 'AMERICAN DELI'
            };
            this.tramite = 'Registro';
            this.numeroRegistro = 'No cuenta con Registro de Turismo';
        }

        // Verificar si puede avanzar en el paso inicial
        this.verificarProgreso();
    }

    obtenerDatosEstablecimiento(): void {
        // Ejemplo de cómo obtener datos del estado de navegación
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras?.state) {
            this.establecimiento = navigation.extras.state['establecimiento'] || {};
            this.tramite = navigation.extras.state['tramite'] || 'Registro';
            this.numeroRegistro = navigation.extras.state['numeroRegistro'] || 'No cuenta con Registro de Turismo';
        } else {
            // O obtener desde parámetros de ruta
            this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.cargarEstablecimientoPorId(params['id']);
                }
            });
        }
    }

    private cargarEstablecimientoPorId(id: string): void {
        // Simulación de llamada a servicio
        // En una app real, aquí harías una llamada HTTP
        this.establecimiento = {
            id: id,
            nombre: 'AMERICAN DELI'
        };
        this.tramite = 'Registro';
        this.numeroRegistro = 'No cuenta con Registro de Turismo';
    }

    regresarAEstablecimientos(): void {
        this.router.navigate(['/establecimientos']);
    }

    // Métodos del Stepper
    siguientePaso(): void {
        if (this.pasoActual < this.totalPasos && this.puedeAvanzar) {
            this.pasosCompletados[this.pasoActual - 1] = true;
            this.pasoActual++;
            this.verificarProgreso();
        }
    }

    pasoAnterior(): void {
        if (this.pasoActual > 1) {
            this.pasoActual--;
            this.verificarProgreso();
        }
    }

    onPasoCompletado(completado: boolean): void {
        this.puedeAvanzar = completado;
        this.pasosCompletados[this.pasoActual - 1] = completado;

        // Si es el paso 1 y está completado, avanzar automáticamente
        if (this.pasoActual === 1 && completado) {
            setTimeout(() => {
                this.siguientePaso();
            }, 500); // Pequeño delay para que el usuario vea el cambio
        }
    }

    private verificarProgreso(): void {
        // Lógica para determinar si se puede avanzar según el paso actual
        switch (this.pasoActual) {
            case 1:
                // En el primer paso, verificar si el formulario de datos generales está completo
                this.puedeAvanzar = true; // Por defecto true para prueba
                break;
            case 2:
                // En el segundo paso, verificar si los documentos están subidos
                this.puedeAvanzar = true;
                break;
            case 3:
                // En el tercer paso, siempre se puede finalizar
                this.puedeAvanzar = true;
                break;
        }
    }

    finalizarProceso(): void {
        console.log('Proceso de acreditación completado');
        console.log('Datos del establecimiento:', this.establecimiento);
        console.log('Pasos completados:', this.pasosCompletados);

        // Aquí puedes enviar los datos al backend
        // this.acreditacionService.enviarSolicitud(this.establecimiento).subscribe(...)

        // Mostrar mensaje de éxito o navegar a otra página
        alert('¡Solicitud de acreditación enviada exitosamente!');
    }

    // Métodos para navegar directamente a un paso (opcional)
    irAPaso(paso: number): void {
        if (paso >= 1 && paso <= this.totalPasos) {
            // Solo permitir ir a un paso si los anteriores están completados
            const pasosAnterioresCompletos = this.pasosCompletados.slice(0, paso - 1).every((p) => p);

            if (paso === 1 || pasosAnterioresCompletos) {
                this.pasoActual = paso;
                this.verificarProgreso();
            }
        }
    }

    get progresoPorcentaje(): number {
        const pasosCompletos = this.pasosCompletados.filter((p) => p).length;
        return (pasosCompletos / this.totalPasos) * 100;
    }

    // Métodos temporales para el demo
    completarPaso1(): void {
        this.puedeAvanzar = true;
        this.pasosCompletados[0] = true;
    }

    completarPaso2(): void {
        this.puedeAvanzar = true;
        this.pasosCompletados[1] = true;
    }
}
