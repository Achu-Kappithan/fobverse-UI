import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast, ToastType } from './toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();
  private nextId = 0;

  show(type: ToastType, title: string, message?: string, duration: number = 5000): number {
    const id = this.nextId++;
    const toast: Toast = { id, type, title, message, duration, closing: false };
    
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration || 5000);
    }
    return id;
  }

  success(title: string, message?: string, duration: number = 5000): void {
    this.show('success', title, message, duration);
  }

  error(title: string, message?: string, duration: number = 5000): void {
    this.show('error', title, message, duration);
  }

  info(title: string, message?: string, duration: number = 3000): void {
    this.show('info', title, message, duration);
  }

  warning(title: string, message?: string, duration: number = 3000): void {
    this.show('warning', title, message, duration);
  }

  loading(title: string, message?: string): number {
    return this.show('loading', title, message, 0);
  }

  remove(id: number): void {
    const currentToasts = this.toastsSubject.value;
    const toastIndex = currentToasts.findIndex((t) => t.id === id);
    
    if (toastIndex !== -1 && !currentToasts[toastIndex].closing) {
      const newToasts = currentToasts.map(t => 
        t.id === id ? { ...t, closing: true } : t
      );
      this.toastsSubject.next(newToasts);

      setTimeout(() => {
        const updatedToasts = this.toastsSubject.value.filter((t) => t.id !== id);
        this.toastsSubject.next(updatedToasts);
      }, 300);
    }
  }
}
