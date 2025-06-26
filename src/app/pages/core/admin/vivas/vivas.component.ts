// Copia y pega esto en vivas.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vivas',
  templateUrl: './vivas.component.html',
  styleUrls: ['./vivas.component.scss']
})
export class VivasComponent implements OnInit {

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      avatar: [''],
      cellPhone: [''],
      email: [''],
      birthdate: [''],
      identification: [''],
      lastname: [''],
      password: [''],
      personalEmail: [''],
      phone: [''],
      name: [''],
      username: ['']
    });
  }

  enviar() {
    console.log(this.formulario.value);
  }
}
