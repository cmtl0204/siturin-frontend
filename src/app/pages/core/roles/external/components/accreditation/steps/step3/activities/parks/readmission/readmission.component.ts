import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnvironmentalPermissionInfoComponent } from "../shared/environmental-permission-info/environmental-permission-info.component";
import { PeopleCapacityComponent } from "../shared/people-capacity/people-capacity.component";
import { CustomMessageService } from '@utils/services/custom-message.service';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-readmission',
  imports: [EnvironmentalPermissionInfoComponent, PeopleCapacityComponent, Button],
  templateUrl: './readmission.component.html',
  styleUrl: './readmission.component.scss'
})
export class ReadmissionComponent {
  @Output() dataOut = new EventEmitter<FormGroup>();
  @ViewChildren(EnvironmentalPermissionInfoComponent) private info!: QueryList<EnvironmentalPermissionInfoComponent>;
  @ViewChildren(PeopleCapacityComponent) private capacity!: QueryList<PeopleCapacityComponent>;

  private formBuilder = inject(FormBuilder);
  protected mainForm = this.formBuilder.group({});
  protected readonly customMessageService = inject(CustomMessageService);

  protected readonly PrimeIcons = PrimeIcons;

  saveForm(childForm: FormGroup) {
    Object.keys(childForm.controls).forEach(name => {
      const control = childForm.get(name);
      if (control && !this.mainForm.contains(name)) {
        this.mainForm.addControl(name, control);
      } else {
        this.mainForm.get(name)?.patchValue(control?.value);
      }
    });
  }

  onSubmit() {
    if (this.checkFormErrors()) this.dataOut.emit(this.mainForm);
  }

  checkFormErrors() {
    const errors = [
      ...this.info.toArray().flatMap(c => c.getFormErrors()),
      ...this.capacity.toArray().flatMap(c => c.getFormErrors())
    ];
    if (errors.length > 0) {
      this.customMessageService.showFormErrors(errors);
      return false;
    }
    return true;
  }
}
