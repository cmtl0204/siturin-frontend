import { Component, inject, OnInit } from '@angular/core';
import { JuridicalPersonComponent } from '@modules/core/roles/external/components/accreditation/steps/step1/juridical-person/juridical-person.component';
import { CoreSessionStorageService } from '@utils/services';
import { Button } from 'primeng/button';
import { CoreEnum } from '@utils/enums';
import { ProcessI } from '@utils/services/core-session-storage.service';

@Component({
    selector: 'app-step1',
    imports: [JuridicalPersonComponent, Button],
    templateUrl: './step1.component.html',
    styleUrl: './step1.component.scss'
})
export class Step1Component implements OnInit {
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    async ngOnInit() {
        await this.saveData({
            id: 'e30fba26-4b77-44f0-8c46-27e6d3f63b47',
            type: { id: '4cc349ad-460e-4aba-8ef3-14513db7a16d', code: 'registration' }
        });
    }

    async saveData(value: ProcessI) {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, value);
    }
}
