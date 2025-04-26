import { Component, Output,EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Output() logoutRequested = new EventEmitter<void>();
  showLogoutModal = false;
  showGoodbyeMessage = false;

  constructor(public authService: AuthService) {}

  hasRole(roles: string[]) {
    return this.authService.hasAnyRole(roles);
  }
  confirmLogout() {
    this.logoutRequested.emit(); //Emite al padre para que abra el modal
  }

}

