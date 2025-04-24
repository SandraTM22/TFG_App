import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [NavbarComponent, RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {

}
