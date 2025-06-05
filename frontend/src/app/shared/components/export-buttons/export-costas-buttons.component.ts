import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Costa } from '../../interfaces/costa';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExportCostasService } from '../../services/exportCostas.service';

@Component({
  selector: 'app-export-buttons',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './export-costas-buttons.component.html',
  styleUrl: './export-buttons.component.css',
})
export class ExportButtonsComponent {
  /** Lista de costas ya filtrada (sin paginar) */
  @Input() filteredCostas: Costa[] = [];
  /** Campo de orden actual ('fechaTC' | ... | '') */
  @Input() sortField: string = '';
  /** Dirección de orden ('asc' | 'desc') */
  @Input() sortDir: 'asc' | 'desc' = 'asc';

  constructor(private exportCostasService: ExportCostasService) {}

  exportExcel() {
    this.exportCostasService.exportCostasToExcel(
      this.filteredCostas,
      this.sortField,
      this.sortDir
    );
  }

  exportPDF() {
    this.exportCostasService.exportCostasToPDF(
      this.filteredCostas,
      this.sortField,
      this.sortDir
    );
  }
}
