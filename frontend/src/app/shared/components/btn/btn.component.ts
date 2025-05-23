import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn',
  standalone: true,  
  imports: [],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.css'
})
export class BtnComponent {
  @Input() disabled = false; // Esto permite que el botón reciba [disabled]
}
