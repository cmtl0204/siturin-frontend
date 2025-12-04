import { Component, EventEmitter, inject, OnInit, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { BusinessInfoComponent } from './business-info-component/business-info-component.component';
import { StaffComponent } from '@modules/core/roles/external/components/accreditation/steps/step2/staff/staff.component';
import { ContactPersonComponent } from '@modules/core/roles/external/components/accreditation/steps/step2/contact-person/contact-person.component';
import { Fluid } from 'primeng/fluid';
import { AddressComponent } from '@modules/core/roles/external/components/accreditation/steps/step2/address/address.component';
import { CoreEnum } from '@utils/enums';

@Component({
    selector: 'app-step2',
    imports: [Button, BusinessInfoComponent, StaffComponent, ContactPersonComponent, Fluid, AddressComponent],
    templateUrl: './step2.component.html',
    styleUrl: './step2.component.scss'
})
export class Step2Component implements OnInit {
    @ViewChildren(BusinessInfoComponent) private businessInfoComponent!: QueryList<BusinessInfoComponent>;
    @ViewChildren(ContactPersonComponent) private contactPersonComponent!: QueryList<ContactPersonComponent>;
    @ViewChildren(StaffComponent) private staffComponent!: QueryList<StaffComponent>;
    @ViewChildren(AddressComponent) private addressComponent!: QueryList<AddressComponent>;

    @Output() step: EventEmitter<number> = new EventEmitter<number>();
    protected step2Data = signal<any>(null);

    protected readonly PrimeIcons = PrimeIcons;

    private formBuilder = inject(FormBuilder);
    protected mainForm!: FormGroup;

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);

    constructor() {
        this.mainForm = this.formBuilder.group({});
    }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.step2Data.set(await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step2));
    }

    saveForm(childForm: FormGroup) {
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    onSubmit() {
        if (this.checkFormErrors()) this.saveProcess();
    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.businessInfoComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.contactPersonComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.staffComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.addressComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    async saveProcess() {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.step2, { ...this.mainForm.value });
        this.step.emit(3);
    }

    back() {
        this.step.emit(1);
    }
}
