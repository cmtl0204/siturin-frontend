import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-accommodation',
  imports: [],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss'
})
export class AccommodationComponent {
    @Input() processTypeCode: string = 'registration';
    @Output() dataOut = new EventEmitter<FormGroup>();
}
