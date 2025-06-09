import { Directive, ElementRef, HostBinding, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, Validators } from '@angular/forms';

@Directive({
    selector: '[appLabel]'
})
export class LabelDirective implements OnInit {
    @HostBinding('style.display') display = 'block';
    @HostBinding('style.width') width = '100%';
    @HostBinding('style.white-space') whiteSpace = 'normal';
    private elementRef: ElementRef = inject(ElementRef);
    private renderer = inject(Renderer2);
    private _required: boolean = false;
    @Input() label: string = '';

    @Input() set required(value: AbstractControl | null) {
        if (value) {
            this._required = value.hasValidator(Validators.required) || value.hasValidator(Validators.requiredTrue);
        }
    }

    constructor() {}

    ngOnInit(): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', '');

        if (this._required) {
            const requiredSymbol = this.renderer.createElement('i');
            this.renderer.addClass(requiredSymbol, 'pi');
            this.renderer.addClass(requiredSymbol, 'pi-asterisk');
            this.renderer.setStyle(requiredSymbol, 'font-size', '0.6rem');
            this.renderer.addClass(requiredSymbol, 'text-red-500');
            this.renderer.addClass(requiredSymbol, 'text-lg');
            this.renderer.addClass(requiredSymbol, 'mr-1');
            this.renderer.appendChild(this.elementRef.nativeElement, requiredSymbol);
        }

        if (this.label) {
            const tmp = this.renderer.createElement('span');
            tmp.innerHTML = this.label + ':'; // agregar los dos puntos si lo deseas
            Array.from(tmp.childNodes).forEach((child) => {
                this.renderer.appendChild(this.elementRef.nativeElement, child);
            });
        }
    }
}
