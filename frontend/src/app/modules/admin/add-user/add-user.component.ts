import { Component, Output, EventEmitter } from '@angular/core';
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
import { MailValidator } from '../../../shared/validators/mail.validators';
import { RolesValidator } from '../../../shared/validators/roles.validators';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { ToastService } from '../../../shared/services/toast.service';
import { BtnComponent } from '../../../shared/components/btn/btn.component';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
    BtnComponent,
  ],
  templateUrl: './add-user.component.html', 
})
export class AddUserComponent {
  /**
   * Evento que avisa al componente padre que se ha añadido un usuario.
   * Se emite tras completar con éxito la creación.
   */
  @Output() userAdded = new EventEmitter<void>();

  /** FormGroup que agrupa todos los controles del formulario de alta */
  formAdd: FormGroup = new FormGroup({});
  /** Listado completo de usuarios (se carga para poder refrescar la vista) */
  users: User[] = [];
  /** Copia de `users` usada para vistas filtradas si fuese necesario */
  filteredUsers: User[] = [];

  /** Roles disponibles para asignar al crear un usuario */
  roles = ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_USER_LIMITED'];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Construye el formulario y carga usuarios al iniciar
    this.buildForm();
    this.loadUsers();
  }

  /**
   * Crea un nuevo usuario usando el servicio.
   * - Recoge los valores del formulario.
   * - Llama a `userService.addUser()`.
   * - Al éxito: recarga la lista, muestra toast, resetea form y notifica al padre.
   * - Al error: muestra un toast de error.
   */
  addUser(): void {
    const newUser: User = {
      name: this.formAdd.controls['name'].value!,
      email: this.formAdd.controls['email'].value!,
      password: this.formAdd.controls['password'].value!,
      roles: this.formAdd.controls['roles'].value!,
    };

    this.userService.addUser(newUser).subscribe({
      next: () => {
        // Recargamos datos y avisamos
        this.loadUsers();
        this.toastService.showToast(
          'success',
          'Usuario añadido correctamente',
          3000
        );
        // limpiar el formulario
        this.formAdd.reset();
        // emitir al padre
        this.userAdded.emit();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.toastService.showToast('error', 'Error al añadir usuario', 3000);
      },
    });
  }

  /**
   * Obtiene la lista de usuarios desde el backend.
   * Se suscribe a `userService.getUsers()` y actualiza `users` y `filteredUsers`.
   */
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        this.filteredUsers = users; // Para que se actualice cuando se añade un nuevo user
      },
      (error) => console.error('Error fetching users:', error)
    );
  }

  /**
   * Construye el formulario de alta con sus validadores
   */
  private buildForm(): void {
    this.formAdd = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, MailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      //search: [''],
      roles: this.formBuilder.array([], RolesValidator), //Using the FormBuilder to create a FormArray, which allows you to handle multiple elements as if they were a single form control
    });
  }

  /**
   * Manejador para los checkboxes de rol:
   * - Si se marca, añade un FormControl con el rol al FormArray.
   * - Si se desmarca, busca y elimina ese FormControl.
   */
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
  }

  /**
   * Comprueba si el formulario es inválido o no se ha marcado ningún rol.
   * Para deshabilitar el botón de submit.
   */
  isFormInvalid(): boolean {
    const rolesArray = this.formAdd.get('roles') as FormArray;
    return this.formAdd.invalid || rolesArray.length === 0;
  }

  resetForm() {
    this.formAdd.reset();
  }
}
