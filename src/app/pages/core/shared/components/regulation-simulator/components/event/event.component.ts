import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegulation, Item } from '../../models/item.interface';
import { PanelModule } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { data, items } from './data';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { ContributorTypeEnum } from '../../enum';

@Component({
    selector: 'app-event',
    imports: [PanelModule, ToggleSwitchModule, ReactiveFormsModule],
    templateUrl: './event.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventComponent {
    private readonly fb = inject(FormBuilder);
    public classificationInput = input<ClassificationInterface|null>();
    public contributorType = input.required<ContributorTypeEnum>();
    protected classification = signal<HeaderRegulation | null>(null);
    form!: FormGroup;

    buildForm = effect(() => {
        console.log('event component');
        
        if (!this.classificationInput()) return;
        
        this.classification.set(data.find((item) => item.codeClassification === this.classificationInput()?.code) ?? null);
        console.log(this.contributorType());
        
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
