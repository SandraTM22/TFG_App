import { Component } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MailValidator } from '../../shared/validators/mail.validators';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ErrorMessageComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  form: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  errorMessage: string | null = null;
 

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token && !this.authService.isTokenExpired(token)) {
      this.router.navigate(['home']);
    }
    this.buildForm();
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, MailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      console.log(
        `datos desde ts login - USER: ${value.email} - PASSWORD: ${value.password}`
      );

      this.authService.login(value.email, value.password).subscribe(
        (response) => {
          this.authService.saveToken(response.token);
          this.router.navigate(['home']);
        },
        (error) => {
          this.showLoginError('Credenciales incorrectas');
        }
      );
    } else {
      console.log('Formulario inválido');
      return
    }
    this.form.reset(); // Limpia el formulario después de login
  }

  showLoginError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
  }
  
}
