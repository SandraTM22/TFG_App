import { Component } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from "./error-message/error-message.component";

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, ReactiveFormsModule,CommonModule,ErrorMessageComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  standalone: true,
})
export class LoginPageComponent {
  
  form: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

    login(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      console.log(`USER: ${value.email} - PASSWORD: ${value.password}`);
      // Aquí agregar la lógica de autenticación
    }
  }
}
