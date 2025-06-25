import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sotomayor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sotomayor.component.html',
  styleUrls: ['./sotomayor.component.scss']
})
export class SotomayorComponent {
  forms!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.forms = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.matchPasswords });
  }

  matchPasswords(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsNoMatch: true }
      : null;
  }

  campoInvalido(campo: string): boolean {
    const control = this.forms.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.forms.valid) {
      console.log('Formulario enviado:', this.forms.value);
    } else {
      this.forms.markAllAsTouched();
    }
  }
}
