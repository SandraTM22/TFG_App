import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/interfaces/user';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.css',
})
export class ModalEditComponent {
  @Input() user: User | null = null; //Recibe un usuario
  @Output() cancel = new EventEmitter<void>(); // Enviamos al padre el evento que se cancela edicion
  @Output() save = new EventEmitter<User>(); // Enviamos al padre el usuario editado

  constructor(private userService: UserService) {}

  //Método para agregar un rol seleccionado
  onEditRoleChange(role: string, event: Event): void {
    if (!this.user) return;

    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked && !this.user.roles.includes(role)) {
      // Añade el rol si se marca y no estaba
      this.user.roles.push(role);
    } else if (!isChecked) {
      // Si se desmarca, lo quita
      const index = this.user.roles.indexOf(role);
      if (index !== -1) {
        this.user.roles.splice(index, 1);
      }
    }
  }

  saveEdit() {
    //si userBeingEdited no tienen ningun valor, entonces sal..
    if (!this.user) return;
    else {
      this.save.emit(this.user);
    }
  }

  cancelEdit(): void {
    this.cancel.emit();
  }
}
