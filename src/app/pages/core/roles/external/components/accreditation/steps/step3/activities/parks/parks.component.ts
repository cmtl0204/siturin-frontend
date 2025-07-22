import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegistrationComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/parks/registration/registration.component';
import { ReclassificationComponent } from "./reclassification/reclassification.component";
import { ReadmissionComponent } from "./readmission/readmission.component";
import { UpdateComponent } from "./update/update.component";
import { CommonModule } from '@angular/common';
import { CoreSessionStorageService } from '@utils/services';
import { CoreEnum } from '@utils/enums';
//import { UpdateComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/parks/update/update.component';

@Component({
  selector: 'app-parks',
  standalone: true,
  imports: [RegistrationComponent, ReclassificationComponent, ReadmissionComponent, UpdateComponent, CommonModule],
  templateUrl: './parks.component.html',
  styleUrl: './parks.component.scss'
})
export class ParksComponent {
  @Output() dataOut = new EventEmitter<FormGroup>();
  @Input() mode: string = 'registration';

    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected process$ = this.coreSessionStorageService.processSignal;

    constructor() {
        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                const process = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);
                console.log('Signal updated:', process);
                // this.cambiarPantalla(process);
            }
        });
    }

}

