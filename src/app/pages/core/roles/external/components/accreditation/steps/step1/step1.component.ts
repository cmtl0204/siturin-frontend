import {
    Component,
    EventEmitter,
    effect,
    inject,
    input,
    OnInit,
    Output,
    QueryList,
    signal,
    ViewChildren
} from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import {
    JuridicalPersonComponent
} from '@modules/core/roles/external/components/accreditation/steps/step1/juridical-person/juridical-person.component';
import { Button } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { SriComponent } from '@modules/core/shared/components/sri/sri.component';
import { CoreEnum } from '@utils/enums';

@Component({
    selector: 'app-step1',
    imports: [JuridicalPersonComponent, Button, Fluid, SriComponent],
    templateUrl: './step1.component.html',
    styleUrl: './step1.component.scss'
})
export class Step1Component implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly router = inject(Router);

    @Output() step: EventEmitter<number> = new EventEmitter<number>();
    @ViewChildren(JuridicalPersonComponent) private juridicalPersonComponent!: QueryList<JuridicalPersonComponent>;

    private formBuilder = inject(FormBuilder);
    protected mainForm!: FormGroup;

    protected step1Data = signal<any>(null);

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);

    constructor() {
        this.mainForm = this.formBuilder.group({});

        this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, {
            processId:'2b914dbf-0eab-4ec4-93ff-9b5df1bf336b',
            type: {
                id: '4cc349ad-460e-4aba-8ef3-14513db7a16d',
                code: 'registration',
                name: 'Registro'
            }
        });
    }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.step1Data.set(await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step1));
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
        const errors: string[] = [...this.juridicalPersonComponent.toArray().flatMap((c) => c.getFormErrors())];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    async saveProcess() {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.step1, { ...this.mainForm.value });

        this.step.emit(2);
    }

    back() {
        this.router.navigateByUrl(MY_ROUTES.corePages.external.establishment.absolute);
    }
}
