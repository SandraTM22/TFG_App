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

//Angular material
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
  // Lista total de usuarios obtenida del backend
  users: User[] = [];
  // Lista para la página actual (después de filtrar y paginar)
  pagedUsers: User[] = [];
  // índice de la fila en edición (o null)
  currentEditRow: number | null = null;
  // referencia al usuario que estamos editando
  editingUser: User | null = null;

  // Flag para mostrar/ocultar el formulario de añadir usuario
  showAddUser = false;

  //Paginator
  pageSize = 10;
  pageIndex = 0;

  // Filtro
  filterField: 'name' | 'email' | '' = '';
  filterValue = '';

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
      this.updatePaged();
    });

    this.loadAllUsers();
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
        this.toastService.showToast('info', 'Usuario modificado', 3000);
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Error al modificar usuario:', err);
        this.toastService.showToast(
          'error',
          'Error al modificar usuario',
          3000
        );
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

  /* *
   * Cambia el valor del bool "active" y lo guarda en la bbdd
   */
  toggleUserActive(user: User) {
    const updatedUser: User = { ...user, active: !user.active };
    this.saveEdit(updatedUser);
  }

  /* **************************************** BORRADO DE USUARIO ************************************* */
  /**
   * Elimina un usuario por ID
   */
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      const idx = this.users.findIndex((x) => x.id === id);
      if (idx >= 0) {
        this.users.splice(idx, 1);
        this.updatePaged();
      }
      this.toastService.showToast('error', 'Usuario eliminado', 3000);
    });
  }

  /* **************************************** CARGA Y PAGINACIÓN DATOS ************************************* */
  loadAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: (list) => {
        this.users = list;
        this.updatePaged();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaged();
  }

  updatePaged() {
    let filtered = this.users;

    // Si hay algún campo seleccionado y texto escrito, filtramos:
    if (this.filterField && this.filterValue.trim().length) {
      const texto = this.filterValue.toLowerCase();
      filtered = this.users.filter((u) => {
        if (this.filterField === 'name') {
          return u.name.toLowerCase().includes(texto);
        }
        if (this.filterField === 'email') {
          return u.email.toLowerCase().includes(texto);
        }
        return true;
      });
    }
    const start = this.pageIndex * this.pageSize;
    this.pagedUsers = filtered.slice(start, start + this.pageSize);
  }

  /* **************************************** FILTRO ************************************* */
  /**
   * Cuando el <mat-select> cambia de valor, reiniciamos filterValue y la paginación
   */
  onFilterFieldChange(field: 'name' | 'email' | ''): void {
    this.filterField = field;
    this.filterValue = '';
    this.pageIndex = 0;
    this.updatePaged();
  }

  /**
   * Resetea el filtro completamente
   */
  clearFilter(): void {
    this.filterField = '';
    this.filterValue = '';
    this.pageIndex = 0;
    this.updatePaged();
  }
}
