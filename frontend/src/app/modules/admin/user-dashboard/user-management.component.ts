import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../shared/interfaces/user';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../shared/toast/toast.component';
import { ModalEditComponent } from '../modal-edit/modal-edit.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-user-management',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalEditComponent,
    AddUserComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  // Accede al componente del Toast y se inicializa en indefinido
  //@ViewChild(ToastComponent) toast: ToastComponent | undefined;

  //Declaramos user para el modal, para editar, que puede ser un usuario o null. Se inicia en null
  userBeingEdited: User | null = null;
  showAddUser = false;

  users: User[] = [];
  filteredUsers: User[] = [];

  constructor(private userService: UserService, private toastService:ToastService) {}

  ngOnInit(): void {
    // inicializa la carga del subjet "User"
    this.userService.init();

    // subscripción al observable
    this.userService.users$.subscribe((list) => {
      this.users = list;
      this.filteredUsers = list;
    });
  }

  //Método para modificar los roles
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

  //Método para obtener un nombre amigable del rol
  getRoleDisplayName(role: string): string {
    const roleMapping: { [key: string]: string } = {
      ROLE_ADMIN: 'Admin',
      ROLE_USER: 'Super',
      ROLE_USER_LIMITED: 'User',
    };
    return roleMapping[role] || role; // Si no hay mapeo, devuelve el valor original del rol
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

  updateUser(user: User): void {
    //clonamos el usuario
    this.userBeingEdited = { ...user, roles: [...user.roles] };
  }

  saveEdit() {
    //si userBeingEdited no tienen ningun valor, entonces sal..
    if (!this.userBeingEdited) return;

    this.userService.updateUser(this.userBeingEdited).subscribe(() => {
      this.loadUsers(),
        this.toastService.addToast('info', 'Usuario modifcado', 3000);
      this.userBeingEdited = null; // Cerramos el modal
    });
  }

  cancelEdit(): void {
    this.toastService.addToast(
      'warning',
      'The edition has been cancelled',
      3000
    );
    this.userBeingEdited = null; // Cerramos el modal sin guardar
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.loadUsers(),
        this.toastService.addToast('error', 'Usuario eliminado', 3000);
    });
  }

  toggleAddUser(): void {
    this.showAddUser = !this.showAddUser;
  }

  // cuando el hijo emite userAdded, ocultamos el formulario
  onUserAdded(): void {
    this.loadUsers();
    this.showAddUser = false;
  }
}
