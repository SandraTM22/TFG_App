import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  showLogoutModal = false;
  showGoodbyeMessage = false;

  constructor(public authService: AuthService) {}

  hasRole(role: string) {
    return this.authService.hasAnyRole([role]);
  }
  confirmLogout() {
    this.showLogoutModal = true;
  }

  logout() {    
    this.showLogoutModal = false;
    this.showGoodbyeMessage = true;
    return this.authService.logout();
  }
  
  LogoutModal(){
    if (this.showLogoutModal) {
      return true
    }
    return false
  }
}

