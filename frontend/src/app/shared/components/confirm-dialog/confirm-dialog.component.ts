import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BtnComponent } from "../btn/btn.component";

// Definimos la interface para los datos que recibe el diálogo
export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, BtnComponent],
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirmar' }}</h2>
    <mat-dialog-content class="pb-4">
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <app-btn (click)="onCancel()" class="p-1 opacity-70">
        {{ data.cancelText || 'Cancelar' }}
      </app-btn>
      <app-btn  (click)="onConfirm()">
        {{ data.confirmText || 'Aceptar' }}
      </app-btn>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        font-size: 14px;
      }
      mat-dialog-actions button {
        min-width: 80px;
      }
    `
  ]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    // Cerrar el diálogo enviando true
    this.dialogRef.close(true);
  }

  onCancel(): void {
    // Cerrar el diálogo enviando false
    this.dialogRef.close(false);
  }
}
