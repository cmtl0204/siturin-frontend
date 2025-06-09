import { Directive, ElementRef, inject, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive({
    selector: '[appErrorMessage]',
    standalone: true
})
export class ErrorMessageDirective implements OnChanges {
    private _elementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    private _renderer = inject(Renderer2);
    private _errors: ValidationErrors | null | undefined = null;
    private _dirty: boolean | null | undefined = false;
    private _touched: boolean | null | undefined = false;
    private readonly _nativeElement: HTMLDivElement;
    private readonly _errorMessages: Record<string, string | ((errors: any) => string)> = {
        required: this.fieldRequired,
        requiredTrue: this.fieldRequired,
        email: this.fieldEmail,
        minlength: this.fieldMinLength,
        maxlength: this.fieldMaxLength,
        min: this.fieldMin,
        max: this.fieldMax,
        pattern: this.fieldPattern,
        noPasswordMatch: this.fieldNoPasswordMatch,
        invalidEmail: this.fieldInvalidEmail,
        invalidEmailMINTUR: this.fieldInvalidEmailMINTUR,
        registeredIdentification: this.fieldRegisteredIdentification,
        unregisteredUser: this.fieldUnregisteredUser,
        pendingPaymentRuc: this.fieldRucPendingPayment,
        unavailableUser: this.fieldUnavailableUser,
        phoneNotAvailable: this.fieldPhoneNotAvailable,
        dateInvalid: this.fieldDateValid,
        dateMax: this.fieldDateMax,
        dateMin: this.fieldDateMin,
        agreementExists: this.fieldAgreementExists,
    };

    constructor() {
        this._nativeElement = this._elementRef.nativeElement;
    }

    ngOnChanges(): void {
        this.setErrorMessage();

    }

    @Input() set touched(value: boolean|null|undefined) {
        this._touched = value;
    }

    @Input() set dirty(value: boolean|null|undefined) {
        this._dirty = value;
    }

    @Input() set errors(value: ValidationErrors | null|undefined) {
        this._errors = value;
    }

    setErrorMessage() {
        let text = '';

        if ((this._touched || this._dirty) && this._errors) {
            for (const key in this._errors) {
                if (this._errorMessages[key]) {
                    const handler = this._errorMessages[key];
                    text = typeof handler === 'function' ? handler(this._errors) : handler;
                    break; // Solo mostramos el primer error encontrado
                }
            }

            this._renderer.addClass(this._nativeElement, 'text-red-500');
        }

        this._renderer.setProperty(this._nativeElement, 'innerText', text);
    }

    private get fieldRequired(): string {
        return 'El campo es obligatorio.';
    }

    private get fieldEmail(): string {
        return 'Correo electrónico no es válido.';
    }

    private fieldMinLength(errors: ValidationErrors) {
        return `Debe contener como mínimo ${errors['minlength']['requiredLength']} caracteres.`;
    }

    private fieldMaxLength(errors: ValidationErrors): string {
        return `Debe contener como máximo de caracteres ${errors['maxlength']['requiredLength']}.`;
    }

    private fieldMin(errors: ValidationErrors) {
        return `Número mínimo permitido es ${errors['min']['min']}.`;
    }

    private fieldMax(errors: ValidationErrors): string {
        return `Número maximo permitido es ${errors['max']['max']}.`;
    }

    private get fieldPattern() {
        return `No cumple con el formato.`;
    }

    private get fieldNoPasswordMatch(): string {
        return 'Las contraseñas no coinciden.';
    }

    private get fieldDateValid(): string {
        return 'No es una fecha válida.';
    }

    private fieldDateMax(errors: ValidationErrors): string {
        return `La fecha ${errors['dateMax']['actualDate']} no puede ser mayor a ${errors['dateMax']['requiredDate']}.`;
    }

    private fieldDateMin(errors: ValidationErrors): string {
        return `La fecha ${errors['dateMin']['actualDate']} no puede ser menor a ${errors['dateMin']['requiredDate']}.`;
    }

    private get fieldIdentification() {
        return `No cumple con el formato de una cédula Ecuatoriana.`;
    }

    private get fieldUserNotAvailable(): string {
        return 'Este usuario ya se encuentra registrado.';
    }

    private get fieldUserAvailable(): string {
        return 'Usuario está disponible.';
    }

    private get fieldInvalidEmail(): string {
        return 'Correo electrónico no es válido.';
    }

    private get fieldInvalidEmailMINTUR(): string {
        return 'Correo electrónico no puede pertencer al MINTUR.';
    }

    private get fieldPhoneNotAvailable(): string {
        return 'Este teléfono no está disponible.';
    }

    private get fieldAgreementExists(): string {
        return 'El número interno de convenio ya se encuentra registrado.';
    }

    private get fieldRegisteredIdentification(): string {
        return 'El RUC ya se encuentra registrado.';
    }

    private get fieldRucPendingPayment(): string {
        return 'El RUC ingresado mantiene pendiente el pago de la Contribución Uno por Mil sobre Activos Fijos, cobrados por esta Cartera de Estado, dentro del periodo de vigencia de la Ley de Turismo de Registro Oficial Suplemento No. 733 de 27 de Diciembre 2002, por favor sírvase asistir a la oficina zonal en la que se encuentra registrado su establecimiento para el trámite de revisión y declaración respectiva.';
    }

    private get fieldUnavailableUser(): string {
        return 'El usuario no se encuentra disponible.';
    }

    private get fieldUnregisteredUser(): string {
        return 'El usuario no se encuentra registrado, por favor registre una cuenta.';
    }
}
