import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  @Input() control: any; // Esto recibe el FormControl desde el formulario
  @Input() fieldName: string = ''; // El nombre del campo para personalizar los mensajes
}
