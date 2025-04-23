import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { User } from '../../../shared/interfaces/user';
import { CommonModule } from '@angular/common';
import { MailValidator } from '../../../shared/validators/mail.validators';
import { RolesValidator } from '../../../shared/validators/roles.validators';
import { ToastComponent } from '../../../shared/toast/toast.component';

@Component({
  selector: 'app-user-management',
  imports: [
    ErrorMessageComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  // Accede al componente del Toast y se inicializa en indefinido
  @ViewChild(ToastComponent) toast: ToastComponent | undefined;

  //Declaramos user para el modal, para editar, que puede ser un usuario o null. Se inicia en null
  userBeingEdited: User | null = null;

  formAdd: FormGroup = new FormGroup({});

  //allowed roles
  roles = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_USER_LIMITED'];

  users: User[] = [];
  filteredUsers: User[] = [];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadUsers();
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

  // Método para obtener los roles (checkbox)
  get roleForms() {
    return (this.formAdd.get('roles') as FormArray).controls;
  }

  // Agregar un rol seleccionado
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

  onEditRoleChange(role: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (!this.userBeingEdited) return;
    if (isChecked) {
      if (!this.userBeingEdited.roles.includes(role)) {
        this.userBeingEdited.roles.push(role);
      }
    } else {
      const index = this.userBeingEdited.roles.indexOf(role);
      if (index !== -1) {
        this.userBeingEdited.roles.splice(index, 1);
      }
    }

    console.log('Roles editados:', this.userBeingEdited.roles);
  }

  getRoleDisplayName(role: string): string {
    const roleMapping: { [key: string]: string } = {
      ROLE_ADMIN: 'Admin',
      ROLE_USER: 'Super',
      ROLE_USER_LIMITED: 'User',
    };
    return roleMapping[role] || role; // Si no hay mapeo, devuelve el valor original del rol
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.filteredUsers = users; // Para que se actualice cuando se añade un nuevo user
      },
      (error) => console.error('Error fetching users:', error)
    );
  }

  addUser(): void {
    const newUser: User = {
      id: 0,
      username: this.formAdd.controls['name'].value!,
      email: this.formAdd.controls['email'].value!,
      password: this.formAdd.controls['password'].value!,
      roles: this.formAdd.controls['roles'].value!,
      firstTime: true,
      active: false,
    };
    console.log('Enviando usuario desdes user mang:', newUser); // Verifica el objeto que se envía

    this.userService.addUser(newUser).subscribe(() => {
      this.loadUsers();
      this.toast?.toastService.addToast(
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

  isFormInvalid(): boolean {
    const rolesArray = this.formAdd.get('roles') as FormArray;
    return this.formAdd.invalid || rolesArray.length === 0;
  }

  updateUser(user: User): void {
    //clonamos el usuario
    this.userBeingEdited = { ...user, roles: [...user.roles] };
  }

  saveEdit() {
    //si userBeingEdited no tienen ningun valor, entonces sal..
    if (!this.userBeingEdited) return;

    this.userService.updateUser(this.userBeingEdited).subscribe(() => {
      this.loadUsers(),
        this.toast?.toastService.addToast('info', 'Usuario modifcado', 3000);
      this.userBeingEdited = null; // Cerramos el modal
    });
  }

  cancelEdit(): void {
    this.toast?.toastService.addToast(
      'warning',
      'The edition has been cancelled',
      3000
    );
    this.userBeingEdited = null; // Cerramos el modal sin guardar
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers(),
        this.toast?.toastService.addToast('error', 'Usuario eliminado', 3000);
    });
  }
}
