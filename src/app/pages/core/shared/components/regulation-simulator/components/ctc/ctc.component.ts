import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegulation, Item } from '../../models/item.interface';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Panel } from 'primeng/panel';
import { data, items } from './data';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { ContributorTypeEnum } from '../../enum';

@Component({
    selector: 'app-ctc',
    imports: [ButtonModule, ReactiveFormsModule, ToggleSwitchModule, Panel],
    templateUrl: './ctc.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtcComponent {
    public contributorType = input.required<ContributorTypeEnum>();
    private readonly fb = inject(FormBuilder);
    public classificationInput = input<ClassificationInterface | null>();
    protected classification = signal<HeaderRegulation | null>(null);
    form!: FormGroup;

    buildForm = effect(() => {
        if (!this.classificationInput()) return;
        
        this.classification.set(data.find((item) => item.codeClassification === this.classificationInput()?.code) ?? null);
        const validatedItems = items.filter((item) => item.person === this.contributorType());
        this.form = this.fb.group({
            items: this.fb.array(validatedItems.map((item) => this.createItemGroup(item)))
        });
    });

    createItemGroup(item: Item): FormGroup {
        return this.fb.group({
            name: [item.label],
            isCompliant: [false]
        });
    }
    onSubmit() {}

    get itemsField(): FormArray {
        return this.form.get('items') as FormArray;
    }
}
