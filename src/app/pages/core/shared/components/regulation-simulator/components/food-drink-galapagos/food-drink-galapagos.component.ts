import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';
import { data, items } from './data';
import { Panel } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { ContributorTypeEnum } from '../../enum';

@Component({
    selector: 'app-food-drink-galapagos',
    imports: [ReactiveFormsModule, Panel, ToggleSwitchModule],
    templateUrl: './food-drink-galapagos.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDrinkGalapagosComponent {
    private readonly fb = inject(FormBuilder);
    public contributorType = input.required<ContributorTypeEnum>();
    public classificationInput = input<ClassificationInterface|null>();
    protected classification = signal<HeaderRegulation | null>(null);
    form!: FormGroup;

    buildForm = effect(() => {
        if (!this.classificationInput()) return;

        this.classification.set(data.find((item) => item.codeClassification === this.classificationInput()?.code) ?? null);

        const validatedItems = items.filter((item) => item.person === this.contributorType() || item.person === ContributorTypeEnum.both);
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
