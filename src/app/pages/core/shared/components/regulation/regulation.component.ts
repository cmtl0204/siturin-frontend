import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { RegulationHttpService } from '@modules/core/shared/services/regulation-http.service';
import { RegulationResponseInterface, RegulationSectionInterface, RegulationItemInterface } from '@modules/core/shared/interfaces';

@Component({
    selector: 'app-regulation',
    imports: [ReactiveFormsModule, ToggleSwitchModule, ButtonModule],
    templateUrl: './regulation.component.html'
})
export class RegulationComponent {
    private readonly regulationHttpService = inject(RegulationHttpService);
    private readonly fb = inject(FormBuilder);

    public modelId = input.required<string>();
    public isProtectedArea = input.required<boolean>();
    public formSubmitted = output<RegulationResponseInterface>();

    protected form!: FormGroup;
    protected sections = signal<RegulationSectionInterface[]>([]);
    private errorMessages: string[] = [];

    loadRegulations(modelId: string) {
        this.regulationHttpService.getRegulationsByModelId(modelId).subscribe((resp) => {
            this.sections.set(resp);
        });
    }

    private readonly reloadRegulation = effect(() => {
        this.loadRegulations(this.modelId());
    });

    buildForm = effect(() => {
        const regularSections = this.sections().filter((section) => !section.isProtectedArea);
        this.form = this.fb.group({
            regulation: [[]],
            category: [{ value: null, disabled: true }], //activo cuando sea alimentos y be
            sections: this.fb.array(regularSections.map((section) => this.createSectionGroup(section)))
        });
    });

    createSectionGroup(section: RegulationSectionInterface): FormGroup {
        return this.fb.group({
            id: [section.id],
            name: [section.name],
            validationType: [section.validationType],
            isProtectedArea: [section.isProtectedArea],
            minimumItems: [section.minimumItems],
            items: this.fb.array(
                section.items.map((item) =>
                    this.fb.group({
                        id: [item.id],
                        name: [item.name],
                        isCompliant: [false],
                        isMandatory: [item.required],
                        score: [item.score]
                    })
                )
            )
        });
    }

    onIsProtectedAreaChanges = effect(() => {
        const protectedSections = this.sections().filter((section) => section.isProtectedArea);

        if (this.isProtectedArea()) {
            this.addProtectedAreaSections(protectedSections);
        } else {
            this.removeProtectedAreaSections(protectedSections);
        }
    });

    addProtectedAreaSections(protectedSections: RegulationSectionInterface[]) {
        protectedSections.forEach((section) => {
            const exists = this.sectionsField.value.some((s: any) => s.id === section.id);
            if (!exists) this.sectionsField.push(this.createSectionGroup(section));
        });
    }

    removeProtectedAreaSections(protectedSections: RegulationSectionInterface[]) {
        protectedSections.forEach((section) => {
            const index = this.sectionsField.controls.findIndex((control) => control.value.id === section.id);
            if (index !== -1) this.sectionsField.removeAt(index);
        });
    }

    onSubmit() {
        this.validateSections();
        if (this.errorMessages.length > 0) return this.showErrors();
        return this.formSubmitted.emit(this.formattedResult);
    }

    get formattedResult(): RegulationResponseInterface {
        const items = this.form.value.sections.flatMap((section: RegulationSectionInterface) => {
            return section.items.map((item) => ({
                id: item.id,
                score: item.score,
                isCompliant: item.isCompliant
            }));
        });

        const category = this.categoryField.value;

        return { items, category };
    }

    validateSections() {
        this.errorMessages = [];

        this.sectionsField.controls.forEach((sectionControl, index) => {
            const section = this.sections()[index];
            if (section.isProtectedArea && !this.isProtectedArea()) return;

            const selectedItems = this.getRegulationItemsField(index).value.filter((item: RegulationItemInterface) => item.isCompliant);

            switch (section.validationType) {
                case 'REQUIRED_ITEMS':
                    this.validateRequiredItems(section, selectedItems);
                    break;
                case 'MINIMUM_ITEMS':
                    this.validateMinimumItems(section, selectedItems);
                    break;
                case 'SCORE_BASED':
                    this.validateScoreBased(selectedItems);
                    break;
            }
        });
    }

    validateRequiredItems(section: RegulationSectionInterface, selectedItems: RegulationItemInterface[]): boolean {
        const requiredItems = section.items.filter((item) => item.required);
        const selectedItemIds = new Set(selectedItems.map((item) => item.id));
        const allRequiredSelected = requiredItems.every((item) => selectedItemIds.has(item.id));

        if (!allRequiredSelected) {
            this.errorMessages.push(`La sección ${section.name} no cumple con los requisitos obligatorios.`);
        }

        return allRequiredSelected;
    }

    validateMinimumItems(section: RegulationSectionInterface, selectedItems: RegulationItemInterface[]): boolean {
        const minimumRequired = section.minimumItems ?? 0;
        const meetsMinimum = selectedItems.length >= minimumRequired;

        if (!meetsMinimum) {
            this.errorMessages.push(`La sección ${section.name} no cumple con el número mínimo de elementos. ` + `Seleccionados: ${selectedItems.length}, mínimo: ${minimumRequired}`);
        }

        const allRequiredSelected = this.validateRequiredItems(section, selectedItems);
        return meetsMinimum && allRequiredSelected;
    }

    validateScoreBased(selectedItems: RegulationItemInterface[]) {
        if (selectedItems.length <= 0) {
            this.errorMessages.push('Debe seleccionar al menos un item para determinar la categoría');
            return;
        }
        const totalScore = selectedItems.reduce((sum, item) => sum + (item.score ?? 0), 0);

        switch (true) {
            case totalScore < 15:
                this.setCategory('Category 1');
                break;
            case totalScore < 20:
                this.setCategory('Category 2');
                break;
            default:
                this.setCategory('Category 3');
                break;
        }
    }

    setCategory(category: string) {
        this.categoryField.enable();
        this.categoryField.setValue(category);
    }

    showErrors() {
        if (this.errorMessages.length > 0) {
            alert(this.errorMessages.join('\n'));
        }
    }

    get sectionsField(): FormArray {
        return this.form.get('sections') as FormArray;
    }

    // get regulationField(): FormArray {
    //     return this.form.get('regulation') as FormArray;
    // }

    get categoryField(): AbstractControl {
        return this.form.controls['category'];
    }

    getRegulationItemsField(sectionIndex: number): FormArray {
        return this.sectionsField.at(sectionIndex).get('items') as FormArray;
    }
}
