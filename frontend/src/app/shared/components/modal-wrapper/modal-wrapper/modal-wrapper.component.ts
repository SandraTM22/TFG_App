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
}
