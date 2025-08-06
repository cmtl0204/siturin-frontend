import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        {{environment.APP_SHORT_NAME}} by
        <a href="https://www.turismo.gob.ec" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">MINTUR</a>
    </div>`
})
export class AppFooter {
    protected readonly environment = environment;
}
