import { inject, Injectable } from '@angular/core';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum, CoreEnum } from '@utils/enums';
import { CoreSessionStorageService } from '@utils/services/core-session-storage.service';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {
    private readonly _customMessageService = inject(CustomMessageService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    async findByType(type: string): Promise<CatalogueInterface[]> {
        let catalogues: CatalogueInterface[] = [];

        if (sessionStorage.getItem(CoreEnum.catalogues)) {
            catalogues = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.catalogues);
            catalogues = Object.values(catalogues);
            catalogues = catalogues.filter((catalogue) => {
                return catalogue.type === type;
            });
        }

        return catalogues;
    }

    async findByCode(code: string, type: string): Promise<CatalogueInterface | undefined> {
        let catalogues: CatalogueInterface[] = [];
        let catalogue!: CatalogueInterface | undefined;

        if (sessionStorage.getItem(CoreEnum.catalogues)) {
            catalogues = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.catalogues);
            catalogues = Object.values(catalogues);
            catalogue = catalogues.find((catalogue) => {
                return catalogue.code === code && catalogue.type === type;
            });
        }

        return catalogue;
    }
}
