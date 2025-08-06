import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegistrationComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/parks/registration/registration.component';
import { ReclassificationComponent } from './reclassification/reclassification.component';
import { ReadmissionComponent } from './readmission/readmission.component';
import { UpdateComponent } from './update/update.component';
import { CommonModule } from '@angular/common';
import { CoreSessionStorageService } from '@utils/services';
import { CatalogueProcessesTypeEnum, CoreEnum } from '@utils/enums';

@Component({
    selector: 'app-parks',
    standalone: true,
    imports: [RegistrationComponent, ReclassificationComponent, ReadmissionComponent, UpdateComponent, CommonModule],
    templateUrl: './parks.component.html',
    styleUrl: './parks.component.scss'
})
export class ParksComponent {
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Input() processTypeCode: string = 'registration';

    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;

    constructor() {}

}
