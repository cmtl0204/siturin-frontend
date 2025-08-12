import { Component } from '@angular/core';
import { CadastreDacListComponent } from '@/pages/core/roles/dac/components/cadastre-dac-list/cadastre-dac-list.component';

@Component({
    selector: 'app-cadastre',
    imports: [CadastreDacListComponent],
    templateUrl: './cadastre.component.html',
    styleUrl: './cadastre.component.scss'
})
export class CadastreComponent {}
