import { Component } from '@angular/core';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CommonModule, NgIf } from '@angular/common';
import { CostaService } from '../../shared/services/costa.service';
import { Costa } from '../../shared/interfaces/costa';
import { ExpedienteService } from '../../shared/services/expediente.service';
import { Expediente } from '../../shared/interfaces/expediente';

@Component({
  selector: 'app-fee-management',
  imports: [BtnComponent, NgIf, CommonModule],
  templateUrl: './fee-management.component.html',
  styleUrl: './fee-management.component.css',
})
export class FeeManagementComponent {
  // Lista total de costas obtenida del backend
  costas: Costa[] = [];
  // Lista filtrada
  filteredCostas: Costa[] = [];
  // Lista total de expedientes obtenida del backend
  exps: Expediente[] = [];
  // Lista filtrada
  filteredExps: Expediente[] = [];

  constructor(
    private costasService: CostaService,
    private expService: ExpedienteService
  ) {}

 
  ngOnInit(): void {
    // inicializa la carga del subjet expedientes
    this.expService.init();

    // subscripción al observable para mantener actualizada la lista de expedientes
    this.expService.getExp().subscribe({
      next: (exps) => {
        this.exps = exps;
      },
      error: (err) => console.error('Error al suscribirse a expedientes', err),
    });

    // Esto carga las costas desde el backend
    this.costasService.init(); 
/* 
    this.costasService.getCostas().subscribe((resp) => {
      this.costas = resp;
    }); */

    this.costasService.costas$.subscribe((list) => {
      this.costas = list;
      this.filteredCostas = list;
    });
  }

  /**
   * Carga todos las costas desde el backend
   */
  loadCostas(): void {
    this.costasService.getCostas().subscribe(
      (costas) => {
        this.costas = costas;
        this.filteredCostas = costas; // Para que se actualice cuando se añade una nueva costa
      },
      (error) => console.error('Error fetching fees:', error)
    );
  }

  /**
   * Carga todos los expedientes desde el backend
   */
  loadExps(): void {
    this.expService.getExp().subscribe(
      (exps) => {
        this.exps = exps;
        this.filteredExps = exps; // Para que se actualice cuando se añade un nuevo exp
      },
      (error) => console.error('Error fetching fees:', error)
    );
  }
}
