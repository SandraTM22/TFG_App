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
import { CostaPayload } from '../../shared/interfaces/costaPayload';
import { EstadoCostas } from '../../shared/interfaces/enum/estado-costas.enum';
import { EstadoCobro } from '../../shared/interfaces/enum/estado-cobro.enum';
//Angular Material
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ExportButtonsComponent } from '../../shared/components/export-buttons/export-costas-buttons.component';

@Component({
  selector: 'app-fee-management',
  standalone: true,
  imports: [
    BtnComponent,
    NgIf,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    ModalWrapperComponent,
    AddModalComponent,
    MatTooltipModule,
    NotaFormComponent,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    ExportButtonsComponent
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

  //Filtro
  filterField: string = '';
  filterValue = ''; // texto a buscar
  estadoEnum: string[] = Object.values(EstadoCostas);
  estadoCobroEnum: string[] = Object.values(EstadoCobro);

  //Short
  sortField: 'fechaTC' | 'fecha15TC' | 'fechaDecreto' | 'fecha20Decreto' | '' =
    '';
  sortDir: 'asc' | 'desc' = 'asc';

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

  public updatePaged() {
    let filtradas = this.costas;

    // Si estamos filtrando por "estado" y hay un valor seleccionado:
    if (this.filterField === 'estado' && this.filterValue) {
      filtradas = this.costas.filter((c) => c.estado === this.filterValue);
    } else if (this.filterField === 'estadoCobro' && this.filterValue) {
      filtradas = this.costas.filter((c) => c.estadoCobro === this.filterValue);
    } else if (this.filterField && this.filterValue.trim().length) {
      const texto = this.filterValue.toLowerCase();

      filtradas = this.costas.filter((c) => {
        switch (this.filterField) {
          case 'cliente':
            // asumamos que el nombre completo del cliente está en c.expediente.cliente
            const cliente = c.expediente?.cliente;
            const nombreCompleto = `${cliente?.nombre || ''} ${
              cliente?.apellido1 || ''
            } ${cliente?.apellido2 || ''}`.toLowerCase();
            return nombreCompleto.includes(texto);
          case 'autos':
            return (c.expediente?.autos || '').toLowerCase().includes(texto);
          /* case 'juzgado':
          return (c.expediente?.juzgado || '').toLowerCase().includes(texto); */
          case 'procurador':
            const proc = c.expediente?.procurador;
            const nombreProc = `${proc?.nombre || ''} ${
              proc?.apellido1 || ''
            }`.toLowerCase();
            return nombreProc.includes(texto);
          case 'procedimiento':
            return (c.expediente?.tipoProcedimiento || '')
              .toLowerCase()
              .includes(texto);
          /*  case 'contrario':
          return (c.expediente?.contrario || '').toLowerCase().includes(texto); */
          default:
            return true;
        }
      });
    }
    //  ORDENAR si sortField está definido (solo fechas)
    if (this.sortField) {
      filtradas.sort((a, b) => {
        let valA: Date;
        let valB: Date;

        switch (this.sortField) {
          case 'fechaTC':
            valA = a.fechaTC ? new Date(a.fechaTC) : new Date(0);
            valB = b.fechaTC ? new Date(b.fechaTC) : new Date(0);
            break;
          case 'fecha15TC':
            valA = a.fecha15TC ? new Date(a.fecha15TC) : new Date(0);
            valB = b.fecha15TC ? new Date(b.fecha15TC) : new Date(0);
            break;
          case 'fechaDecreto':
            valA = a.fechaDecreto ? new Date(a.fechaDecreto) : new Date(0);
            valB = b.fechaDecreto ? new Date(b.fechaDecreto) : new Date(0);
            break;
          case 'fecha20Decreto':
            valA = a.fecha20Decreto ? new Date(a.fecha20Decreto) : new Date(0);
            valB = b.fecha20Decreto ? new Date(b.fecha20Decreto) : new Date(0);
            break;
          default:
            return 0;
        }

        if (valA < valB) return this.sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCostas = filtradas.slice(start, end);
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
      this.costasService.updateCosta(payload.id!, payload).subscribe({
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

  /*******************Filtro************************/
  /**
   *  Maneja el cambio de tipo de filtro
   */
  onFilterFieldChange(field: string) {
    this.filterField = field;
    this.filterValue = '';
    this.updatePaged();
  }

  /**
   *  Resetea el filtro
   */
  clearFilter() {
    this.filterField = '';
    this.filterValue = '';
    this.updatePaged();
  }

  /*******************Short************************/
  /**
   * Alterna el sorting en la columna de fecha que se haga clic.
   */
  toggleSort(
    field: 'fechaTC' | 'fecha15TC' | 'fechaDecreto' | 'fecha20Decreto'
  ): void {
    if (this.sortField === field) {
      // Si ya está ordenado por ese campo, invertimos
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      // Cambiamos a nuevo campo, dirección ascendente por defecto
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.updatePaged();
  }
}
