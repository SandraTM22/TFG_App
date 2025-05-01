import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { User } from '../../../shared/interfaces/user';
import { UserService } from '../../../shared/services/user.service';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { MailValidator } from '../../../shared/validators/mail.validators';
import { RolesValidator } from '../../../shared/validators/roles.validators';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-add-user',
  imports: [FormsModule, ReactiveFormsModule, ErrorMessageComponent, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent {
  
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastService : ToastService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadUsers();
  }

  formAdd: FormGroup = new FormGroup({});

  users: User[] = [];
  filteredUsers: User[] = [];

  //Roles permitidos
  roles = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_USER_LIMITED'];

  //Añadir un nuevo usuario
  addUser(): void {
    const newUser: User = {
      id: 0,
      username: this.formAdd.controls['name'].value!,
      email: this.formAdd.controls['email'].value!,
      password: this.formAdd.controls['password'].value!,
      roles: this.formAdd.controls['roles'].value!,
      firstTime: true,
    };

    this.userService.addUser(newUser).subscribe(() => {
      this.loadUsers();
      this.toastService.addToast(
        'success',
        'Usuario añadido correctamente',
        3000
      ); // '?' Accede solo si `toast` está disponible
    });
    this.formAdd.reset();

    this.roles.forEach((role) => {
      const checkbox = document.querySelector(
        `input[type="checkbox"][value="${role}"]`
      ) as HTMLInputElement | null;
      if (checkbox) {
        checkbox.checked = false;
      }
    });

    const rolesArray = this.formAdd.get('roles') as FormArray;
    while (rolesArray.length) {
      rolesArray.removeAt(0); // Eliminar cada control dentro del FormArray
    }
  }

  //Cargar los usuarios
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.filteredUsers = users; // Para que se actualice cuando se añade un nuevo user
      },
      (error) => console.error('Error fetching users:', error)
    );
  }

  private buildForm(): void {
    this.formAdd = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, MailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      //search: [''],
      roles: this.formBuilder.array([], RolesValidator), //Using the FormBuilder to create a FormArray, which allows you to handle multiple elements as if they were a single form control
    });
  }

  //Método para agregar un rol seleccionado
  onRoleChange(role: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const rolesArray = this.formAdd.get('roles') as FormArray;

    if (isChecked && !rolesArray.value.includes(role)) {
      // Añadir el rol al FormArray si el checkbox está marcado
      rolesArray.push(this.formBuilder.control(role));
    } else {
      // Encontrar el índice del rol en el FormArray
      const index = rolesArray.controls.findIndex(
        (control) => control.value === role
      );
      if (index !== -1) {
        rolesArray.removeAt(index);
      }
    }
    // Verificar el estado del FormArray después de la actualización
    console.log('Roles seleccionados:', rolesArray.value);
  }

  isFormInvalid(): boolean {
    const rolesArray = this.formAdd.get('roles') as FormArray;
    return this.formAdd.invalid || rolesArray.length === 0;
  }
}
