import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { ModalLogoutComponent } from './modal-logout/modal-logout.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, ModalLogoutComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  showLogoutModal = false;
  showGoodbyeMessage = false;

  constructor(public authService: AuthService) {}

  hasRole(roles: string[]) {
    return this.authService.hasAnyRole(roles);
  }
  confirmLogout() {
    this.showLogoutModal = true;
  }

  onLogoutConfirmed() {
    this.showLogoutModal = false;
  }
}

