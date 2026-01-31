import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';
import { Toast } from '../../services/toast/toast.model';
import { Observable, delay } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$.pipe(delay(0));
  }

  ngOnInit(): void {}

  removeToast(id: number): void {
    this.toastService.remove(id);
  }

  getTypeClass(type: string): string {
    return `toast-${type}`;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'fa-solid fa-circle-check';
      case 'error': return 'fa-solid fa-circle-xmark';
      case 'info': return 'fa-solid fa-circle-info';
      case 'warning': return 'fa-solid fa-triangle-exclamation';
      case 'loading': return 'fa-solid fa-spinner fa-spin';
      default: return 'fa-solid fa-bell';
    }
  }
}
