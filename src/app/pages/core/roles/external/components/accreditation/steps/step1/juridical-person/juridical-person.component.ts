import { Component, effect, inject, OnInit } from '@angular/core';
import { CoreSessionStorageService } from '@utils/services';
import { CoreEnum } from '@utils/enums';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-juridical-person',
    imports: [JsonPipe],
    templateUrl: './juridical-person.component.html',
    styleUrl: './juridical-person.component.scss'
})
export class JuridicalPersonComponent implements OnInit {
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected process$ = this.coreSessionStorageService.processSignal;

    constructor() {
        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                // console.log('Signal updated:', await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process));
            }
        });
    }

    async ngOnInit() {
        // await this.saveData();
    }

    async saveData() {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, { id: '1234' });
    }
}
