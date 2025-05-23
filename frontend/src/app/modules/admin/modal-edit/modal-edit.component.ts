import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../shared/interfaces/user';
import { FormsModule } from '@angular/forms';
import { BtnComponent } from "../../../shared/components/btn/btn.component";

@Component({
  selector: 'app-modal-edit',
  imports: [CommonModule, FormsModule, BtnComponent],
  templateUrl: './modal-edit.component.html',  
})
export class ModalEditComponent {
  /**  
   * Usuario a editar.Recibido desde el componente padre.  
   * Si es `null`, el modal no muestra ningún dato.  
   */
  @Input() user: User | null = null;

  /**  
   * Evento que se emite cuando el usuario cancela la edición.  
   * El componente padre escucha este evento para cerrar el modal.  
   */
  @Output() cancel = new EventEmitter<void>();

  /**  
   * Evento que se emite al guardar.  
   * Envía el objeto `User` modificado al componente padre.  
   */
  @Output() save = new EventEmitter<User>(); // Enviamos al padre el usuario editado
  
  /**
   * Gestiona el cambio de estado de un checkbox de rol.
   * Añade o elimina `role` en `user.roles` según `checked`.
   */
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

  /**
   * Invocado al pulsar "Guardar".
   * Emite el usuario modificado al padre, que se encargará de persistirlo.
   */
  saveEdit() {
    //si userBeingEdited no tienen ningun valor, entonces sal..
    if (!this.user) return;
    else {
      this.save.emit(this.user);
    }
  }

  /**
   * Invocado al pulsar "Cancelar".
   * Emite el evento al padre para que cierre el modal sin guardar cambios.
   */
  cancelEdit(): void {
    this.cancel.emit();
  }
}
