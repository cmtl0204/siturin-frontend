import { inject, Injectable } from '@angular/core';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueInterface } from '@utils/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {
    private readonly _customMessageService = inject(CustomMessageService);

    findByType(type: string): CatalogueInterface[] {
        let catalogues: CatalogueInterface[] = [];

        if (sessionStorage.getItem('catalogues')) {
            catalogues = JSON.parse(String(sessionStorage.getItem('catalogues'))) as CatalogueInterface[];

            catalogues = catalogues.filter((catalogue) => {
                return catalogue.type === type;
            });
        }

        return catalogues;
    }
}
