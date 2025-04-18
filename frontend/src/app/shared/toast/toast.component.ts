import { Component } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  


  removeToast(id: number) {
    this.toastService.removeToast(id);
  }
}
