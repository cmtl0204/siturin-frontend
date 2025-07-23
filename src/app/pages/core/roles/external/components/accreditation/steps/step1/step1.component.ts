import { Component, inject, OnInit } from '@angular/core';
import { JuridicalPersonComponent } from '@modules/core/roles/external/components/accreditation/steps/step1/juridical-person/juridical-person.component';
import { CoreSessionStorageService } from '@utils/services';
import { CoreEnum } from '@utils/enums';
import { ProcessI } from '@utils/services/core-session-storage.service';

@Component({
    selector: 'app-step1',
    imports: [JuridicalPersonComponent],
    templateUrl: './step1.component.html',
    styleUrl: './step1.component.scss'
})
export class Step1Component implements OnInit {
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    async ngOnInit() {
        await this.saveData({
            processId: 'e30fba26-4b77-44f0-8c46-27e6d3f63b47',
            type: { id: '4cc349ad-460e-4aba-8ef3-14513db7a16d', code: 'registration' },
            activity: {
                id: '2ee299ac-0241-4e60-a8d6-61113db9e7a8',
                geographicArea: {
                    id: '6c051659-133f-4c5c-8304-0cd44c616428'
                },
                code: 'registration'
            },
            classification: {
                id: '42cb691e-78bb-4f5f-983d-41a49817e536',
                code: 'parques',
                name: 'PARQUE DE ATRACCIONES ESTABLES'
            },
            category: {
                id: '41834644-990d-4928-983e-7ebd36a309bc',
                code: null,
                name: 'Categoría Única'
            }
        });
    }

    async saveData(value: ProcessI) {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, value);
    }
}
