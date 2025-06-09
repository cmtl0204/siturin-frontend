import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        SIAP by
        <a href="https://www.turismo.gob.ec" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">MINTUR</a>
    </div>`
})
export class AppFooter {}
