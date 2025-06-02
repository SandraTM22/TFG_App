import { Component, OnInit } from '@angular/core';
import { CostaService } from '../../shared/services/costa.service';
import { Costa } from '../../shared/interfaces/costa';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ModalWrapperComponent } from '../../shared/components/modal-wrapper/modal-wrapper/modal-wrapper.component';
import { AddModalComponent } from './add-modal/add-modal.component';

@Component({
  selector: 'app-fee-management',
  standalone: true,
  imports: [
    BtnComponent,
    NgIf,
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
    ModalWrapperComponent,
    AddModalComponent,
  ],
  templateUrl: './fee-management.component.html',
  styleUrl: './fee-management.component.css',
})
export class FeeManagementComponent implements OnInit {
  costas: Costa[] = [];

  // Para la fila expandida
  expandedElement: Costa | null = null;

  // Columnas (para colspan)
  displayedColumns: string[] = [
    'estado',
    'cliente',
    'autos',
    'juzgado',
    'procurador',
    'tasacion',
    'plus15',
    'decreto',
    'plus20',
    'procedimiento',
    'contrario',
    'importe',
    'acciones',
  ];

  // Paginación manual
  pageSize = 7;
  pageIndex = 0;
  pagedCostas: Costa[] = [];

  //AddModal
  showModal = false;

  constructor(private costasService: CostaService) {}

  ngOnInit(): void {
    this.costasService.init();
    this.costasService.costas$.subscribe({
      next: (list) => {
        this.costas = list;
        this.updatePaged();        
      },
      error: (err) => console.error('Error al cargar las costas:', err),
    });
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaged();
  }

  private updatePaged() {
    const start = this.pageIndex * this.pageSize;
    this.pagedCostas = this.costas.slice(start, start + this.pageSize);
  }


  /*******************MODAL AÑADIR************************/ 
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;

  }

  onSaveCosta() {
    this.updatePaged();
    this.costasService.refreshCostas();
    this.closeModal();
  }
}
