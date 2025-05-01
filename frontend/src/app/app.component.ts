import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalLogoutComponent } from './shared/components/modal-logout/modal-logout.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalLogoutComponent, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showLogoutModal = false;

  // Recibe el evento desde el navbar
  onLogoutRequested() {
    this.showLogoutModal = true;
  }

  // Recibe el evento desde el modal
  onLogoutConfirmed(confirmed: boolean) {
    this.showLogoutModal = false;
  }
}
