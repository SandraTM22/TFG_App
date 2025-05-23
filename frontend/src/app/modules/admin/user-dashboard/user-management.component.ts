import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../shared/interfaces/user';
import { CommonModule } from '@angular/common';
import { ModalEditComponent } from '../modal-edit/modal-edit.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { ToastService } from '../../../shared/services/toast.service';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper/modal-wrapper.component';

@Component({
  selector: 'app-user-management',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ModalEditComponent,
    AddUserComponent,
    BtnComponent,
    ModalWrapperComponent,
  ],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent {
  // Lista total de usuarios obtenida del backend
  users: User[] = [];
  // Lista filtrada
  filteredUsers: User[] = [];
  // índice de la fila en edición (o null)
  currentEditRow: number | null = null;
  // referencia al usuario que estamos editando
  editingUser: User | null = null;

  // Flag para mostrar/ocultar el formulario de añadir usuario
  showAddUser = false;

  //Con este decorador el padre accede a una instancia del componente hijo
  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // inicializa la carga del subjet "User"
    this.userService.init();

    // subscripción al observable para mantener actualizada la lista de usuarios
    this.userService.users$.subscribe((list) => {
      this.users = list;
      this.filteredUsers = list;
    });
  }

  /**
   * Convierte un nombre de rol técnico (como ROLE_ADMIN) en algo más legible
   */
  getRoleDisplayName(role: string): string {
    const roleMapping: { [key: string]: string } = {
      ROLE_ADMIN: 'Admin',
      ROLE_USER: 'Super',
      ROLE_USER_LIMITED: 'User',
    };
    return roleMapping[role] || role; // Si no hay mapeo, devuelve el valor original del rol
  }

  /**
   * Carga todos los usuarios desde el backend
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
   * Alterna la visibilidad del formulario para añadir usuarios
   */
  toggleAddUser(): void {
    this.showAddUser = !this.showAddUser;
    if (!this.showAddUser) {
      // Si se cierra el modal, reseteamos el formulario llamando a método del hijo
      this.addUserComponent.resetForm();
    }
  }

  /**
   * Cuando el hijo emite userAdded, ocultamos el formulario
   */
  onUserAdded(): void {
    this.showAddUser = false;
  }

  /* **************************************** EDICION ************************************* */
  /**
   * Activa/desactiva la edición de una fila específica
   */
  toggleEdit(index: number, user: User): void {
    if (this.currentEditRow === index) {
      this.cancelEdit();
    } else {
      this.openEdit(index, user);
    }
  }

  /**
   * Activa la edición para una fila concreta, clonando los datos para evitar mutaciones
   */
  openEdit(index: number, user: User) {
    this.currentEditRow = index;
    // clonamos para no mutar directamente hasta guardar
    this.editingUser = { ...user, roles: [...user.roles] };
  }

  /**
   * Guarda los cambios en un usuario editado
   */
  saveEdit(updated: User) {
    if (!updated) return;
    this.userService.updateUser(updated).subscribe({
      next: () => {
        // Refrescar la lista de usuarios, notificar al usuario y cerrar el modal
        this.reload();
        this.toastService.addToast('info', 'Usuario modificado', 3000);
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Error al modificar usuario:', err);
        this.toastService.addToast('error', 'Error al modificar usuario', 3000);
      },
    });
  }

  /**
   * Cancela la edición actual
   */
  cancelEdit() {
    this.currentEditRow = null;
    this.editingUser = null;
  }

  /* **************************************** BORRADO DE USUARIO ************************************* */
  /**
   * Elimina un usuario por ID
   */
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.reload();
      this.toastService.addToast('error', 'Usuario eliminado', 3000);
    });
  }

  /**
   * Vuelve a cargar los usuarios desde el backend
   */
  private reload() {
    this.userService.getUsers().subscribe((list) => {
      this.filteredUsers = [...list];
    });
  }
}
