import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmOptions, ConfirmService } from '../../services/confirm/confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  options: ConfirmOptions | null = null;
  private resolve: ((value: boolean) => void) | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.confirmService.confirm$.subscribe(({ options, resolve }) => {
        this.options = options;
        this.resolve = resolve;
        this.isOpen = true;
      })
    );
  }

  handleConfirm(): void {
    this.isOpen = false;
    this.resolve?.(true);
  }

  handleCancel(): void {
    this.isOpen = false;
    this.resolve?.(false);
  }

  getTypeClass(): string {
    return this.options?.type ? `type-${this.options.type}` : 'type-warning';
  }

  getIcon(): string {
    switch (this.options?.type) {
      case 'danger': return 'fa-solid fa-triangle-exclamation';
      case 'info': return 'fa-solid fa-circle-info';
      default: return 'fa-solid fa-circle-question';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
