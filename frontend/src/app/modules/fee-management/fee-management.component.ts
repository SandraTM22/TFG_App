import { Component } from '@angular/core';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CommonModule, NgIf } from '@angular/common';
import { CostaService } from '../../shared/services/costa.service';
import { Costa } from '../../shared/interfaces/costa';

@Component({
  selector: 'app-fee-management',
  imports: [BtnComponent, NgIf, CommonModule],
  templateUrl: './fee-management.component.html',
  styleUrl: './fee-management.component.css',
})
export class FeeManagementComponent {
  // Lista total de usuarios obtenida del backend
  costas: Costa[] = [];
  // Lista filtrada
  filteredCostas: Costa[] = [];

  constructor(private costasService: CostaService) {}

  costasList = [];

  /**
   * Carga todos las costas desde el backend
   */
  loadCostas(): void {
    this.costasService.getCostas().subscribe(
      (costas) => {
        this.costas = costas;
        this.filteredCostas = costas; // Para que se actualice cuando se añade un nuevo user
      },
      (error) => console.error('Error fetching fees:', error)
    );
  }
}
