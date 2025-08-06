import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegulation, Item } from '../../models/item.interface';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Panel } from 'primeng/panel';
import { data, items } from './data';

@Component({
    selector: 'app-ctc',
    imports: [ButtonModule, ReactiveFormsModule, ToggleSwitchModule, Panel],
    templateUrl: './ctc.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CtcComponent {
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
