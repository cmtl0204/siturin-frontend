import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegulation, Item } from '../../models/item.interface';
import { data, items } from './data';
import { Panel } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-food-drink-galapagos',
    imports: [ReactiveFormsModule, Panel, ToggleSwitchModule],
    templateUrl: './food-drink-galapagos.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDrinkGalapagosComponent {
    itemForm!: FormGroup;
    private readonly fb = inject(FormBuilder);
    public classificationInput = input();
    protected classification = signal<HeaderRegulation | null>(null);
    form!: FormGroup;

    buildForm = effect(() => {
        if (!this.classificationInput()) return;
        console.log(this.classificationInput());
        
        this.classification.set(data.find((item) => item.codeClassification === this.classificationInput()) ?? null);

        console.log(this.classification());

        this.form = this.fb.group({
            items: this.fb.array(items.map((item) => this.createItemGroup(item)))
        });
        console.log(this.form.value);
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
