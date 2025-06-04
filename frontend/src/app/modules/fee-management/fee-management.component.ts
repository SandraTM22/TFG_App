import { Component, OnInit } from '@angular/core';
import { CostaService } from '../../shared/services/costa.service';
import { Costa } from '../../shared/interfaces/costa';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { CommonModule, NgIf } from '@angular/common';
import { ModalWrapperComponent } from '../../shared/components/modal-wrapper/modal-wrapper/modal-wrapper.component';
import { AddModalComponent } from './add-modal/add-modal.component';
import { Nota } from '../../shared/interfaces/nota';
import { NotaFormComponent } from '../../shared/components/notas/modal-notas';
import { NotasService } from '../../shared/services/notas.service';
import { ToastService } from '../../shared/services/toast.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';
//Angular Material
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CostaPayload } from '../../shared/interfaces/costaPayload';

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
    MatTooltipModule,
    NotaFormComponent,
    MatDialogModule,
    MatButtonModule,
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
  pageSize = 10;
  pageIndex = 0;
  pagedCostas: Costa[] = [];

  //Para mostrar/ocultar el modal de alta/edición
  showModal = false;
  costaEnEdicion: Costa | null = null; // costa a editar

  //Notas
  modalNotaVisible = false;
  notaSeleccionada: Nota | null = null;
  costaSeleccionada: Costa | null = null;

  constructor(
    private costasService: CostaService,
    private notasService: NotasService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

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

  /*******************AÑADIR************************/
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.costaEnEdicion = null;
    this.showModal = false;
  }

  /**
   * Este método se suscribe al evento (save) que emitirá el modal con la costa editada.
   * Si costaEnEdicion != null, hacemos PUT /api/costas/{id}, sino POST (alta).
   */
  onSaveCosta(payload: CostaPayload): void {
    if (this.costaEnEdicion) {
      //MODO EDICIÓN: la costaEnEdicion tiene un id, llamamos a PUT
      this.costasService
        .updateCosta(payload.id!, payload)
        .subscribe({
          next: (updatedCosta) => {
            // Reemplazamos en el array
            const idx = this.costas.findIndex((c) => c.id === updatedCosta.id);
            if (idx >= 0) {
              this.costas[idx] = updatedCosta;
              this.updatePaged();
            }
            this.toastService.showToast('success', 'Costa actualizada');
            this.closeModal();
          },
          error: (err) => {
            console.error(err);
            this.toastService.showToast('error', 'Error al actualizar costa');
          },
        });
    } else {
      //MODO ALTA: (en este caso “costaEnEdicion” sería null; POST)
      this.costasService.add(payload).subscribe({
        next: (newCosta) => {
          /* this.costasService.refreshCostas(); */
          this.costas.unshift(newCosta);
          this.updatePaged();
          this.toastService.showToast('success', 'Costa creada');
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          this.toastService.showToast('error', 'Error al crear costa');
        },
      });
    }
  }

  onDeleteCosta(costa: Costa) {
    // Diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: <ConfirmDialogData>{
        title: 'Eliminar costa',
        message: `¿Seguro que quieres eliminar?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.costasService.deleteCosta(costa.id!).subscribe({
          next: () => {
            // Elimina la costa del array local
            const idx = this.costas.findIndex((c) => c.id === costa.id);
            if (idx >= 0) {
              this.costas.splice(idx, 1);
              this.updatePaged(); // recalcula pagedCostas tras el borrado
            }
            this.toastService.showToast('success', 'Costa eliminada');
          },
          error: (err) => {
            console.error(err);
            this.toastService.showToast('error', 'Error al eliminar la costa');
          },
        });
      }
      // Si result es false, el usuario ha cancelado; no hacemos nada
    });
  }
  /*******************EDITAR************************/
  onEditCosta(costa: Costa): void {
    // CopiaR la costa entera para no mutar el objeto en el array
    this.costaEnEdicion = { ...costa };
    this.showModal = true;
  }

  /*******************NOTAS************************/

  onAddNota(costa: Costa) {
    this.modalNotaVisible = true;
    this.notaSeleccionada = null;
    this.costaSeleccionada = costa;
  }

  onEditNota(nota: Nota) {
    this.notaSeleccionada = nota;
    this.modalNotaVisible = true;
  }

  onDeleteNota(nota: Nota, costa: Costa) {
    // Diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: <ConfirmDialogData>{
        title: 'Eliminar nota',
        message: '¿Seguro que quieres eliminar esta nota?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.notasService.delete(nota.id!).subscribe({
          next: () => {
            // Elimina la nota del array local de esa costa
            const idx = costa.notas?.findIndex((n) => n.id === nota.id);
            if (idx !== undefined && idx >= 0 && costa.notas) {
              costa.notas.splice(idx, 1);
            }
            this.toastService.showToast('success', 'Nota eliminada');
          },
          error: (err) => {
            console.error(err);
            this.toastService.showToast('error', 'Error al eliminar la nota');
          },
        });
      }
      //Si es False es que user le ha dado a cancel
    });
  }

  closeModalNota() {
    this.modalNotaVisible = false;
    this.notaSeleccionada = null;
  }

  onNotaGuardada(nuevaNota: Nota): void {
    if (!this.notaSeleccionada) {
      this.costaSeleccionada?.notas?.push(nuevaNota);
    } else {
      const i = this.costaSeleccionada?.notas?.findIndex(
        (n) => n.id === nuevaNota.id
      );
      if (i !== undefined && i >= 0 && this.costaSeleccionada?.notas) {
        this.costaSeleccionada.notas[i] = nuevaNota;
      }
    }

    this.closeModalNota();
  }
}
