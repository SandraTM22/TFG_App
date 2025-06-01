import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-modal-wrapper',
  standalone: true,
  imports: [NgIf],
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.css'],
})
export class ModalWrapperComponent {
  /** Propiedad que controla si el modal es visible o no  */
  @Input() visible = false;
  /** Propiedad para el título que aparecerá en el modal */
  @Input() title = '';
  /** Evento que se emite cuando se quiere cerrar el modal */
  @Output() close = new EventEmitter<void>();

  /**
   * HostListener escucha clicks en el componente (en todo su host)
   * Recibe el elemento donde se hizo click ($event.target)
   */
  /* @HostListener('click', ['$event.target']) */
  /* onBackdropClick(target: HTMLElement) {
    // Si el elemento clicado tiene la clase 'modal-backdrop' (fondo del modal)
    if (target.classList.contains('modal-backdrop')) {
      // Emitimos el evento 'close' para que el padre pueda cerrar el modal
      this.close.emit();
    }
  } */


}
