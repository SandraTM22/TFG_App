import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-modal-logout',
  imports: [CommonModule],
  templateUrl: './modal-logout.component.html',
  styleUrl: './modal-logout.component.css',
})
export class ModalLogoutComponent {
  constructor(private authService: AuthService) {}
  @Input() showLogoutModal = false; // Recibe valor del padre
  @Output() logoutConfirmed = new EventEmitter<boolean>(); // Emite evento al padre
  showGoodbyeMessage = false;

  logout() {
    this.showLogoutModal = false;
    this.showGoodbyeMessage = true;
    this.logoutConfirmed.emit(true); // Notifica al padre
    return this.authService.logout();
  }
}

