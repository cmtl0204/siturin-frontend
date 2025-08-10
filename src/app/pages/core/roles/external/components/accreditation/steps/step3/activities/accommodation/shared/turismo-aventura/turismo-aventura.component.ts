import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Fluid } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  selector: 'app-turismo-aventura',
  imports: [
    CommonModule,
    DropdownModule,
    AutoCompleteModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    Fluid
  ],
  templateUrl: './turismo-aventura.component.html',
  styleUrl: './turismo-aventura.component.scss',
})
export class TurismoAventuraComponent implements OnInit {
   @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  @Input() form!: FormGroup;

  aguaSuggestions: string[] = [
    'Modalidades recreativas en embarcasiones motorizadas (boya, banana, parasailing y esqui acuatico)',
    'Buceo',
    'Kayak de mar',
    'Kayak de lacruste',
    'Kayak de rio',
    'Kite surf',
    'Rafting',
    'Snorkel',
    'Surf',
    'Tubing',
  ];

  aireSuggestions: string[] = ['Alas delta', 'Parapente'];

  tierraSuggestions: string[] = [
    'Cabalgata',
    'Canyoning',
    'Cicloturismo',
    'Escalada',
    'Exploracion de cuevas',
    'Montañismo',
    'Senderismo',
    'Salto de puente',
    'Canopy',
    'Tarabita',
  ];

  filteredAgua: string[] = [];
  filteredAire: string[] = [];
  filteredTierra: string[] = [];

  ngOnInit() {
    this.ensureFormControls();
    this.setupValueChanges();
  }

  ensureFormControls() {
    if (!this.form.contains('agua')) {
      this.form.addControl('agua', this._formBuilder.control([] as string[]));
    }
    if (!this.form.contains('aire')) {
      this.form.addControl('aire', this._formBuilder.control([] as string[]));
    }
    if (!this.form.contains('tierra')) {
      this.form.addControl('tierra', this._formBuilder.control([] as string[]));
    }
    if (!this.form.contains('aventura')) {
      this.form.addControl('aventura', this._formBuilder.control(null as string | null));
    }
  }

  setupValueChanges() {
    this.form.get('agua')?.valueChanges.subscribe(() => this.updateAventura());
    this.form.get('aire')?.valueChanges.subscribe(() => this.updateAventura());
    this.form.get('tierra')?.valueChanges.subscribe(() => this.updateAventura());
  }

  filterAgua(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAgua = this.aguaSuggestions.filter(activity =>
      activity.toLowerCase().includes(query)
    );
  }

  filterAire(event: any) {
    const query = event.query.toLowerCase();
    this.filteredAire = this.aireSuggestions.filter(activity =>
      activity.toLowerCase().includes(query)
    );
  }

  filterTierra(event: any) {
    const query = event.query.toLowerCase();
    this.filteredTierra = this.tierraSuggestions.filter(activity =>
      activity.toLowerCase().includes(query)
    );
  }

  updateAventura() {
    const agua = this.form.get('agua')?.value || [];
    const aire = this.form.get('aire')?.value || [];
    const tierra = this.form.get('tierra')?.value || [];
    const combined = [...agua, ...aire, ...tierra].join(', ');
    this.form.get('aventura')?.setValue(combined || null);
    console.log('Aventura updated:', this.form.get('aventura')?.value);
  }

  validateForm(): string[] {
    const errors: string[] = [];
    const aventura = this.form.get('aventura')?.value;
    if (!aventura) {
      errors.push('Selecciona al menos una actividad de aventura');
    }
    return errors;
  }
}