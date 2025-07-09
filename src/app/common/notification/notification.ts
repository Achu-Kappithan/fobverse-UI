import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../shared/services/notification.service';
@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification implements OnDestroy {

@Input() type: 'success' | 'error' | 'warning' = 'success';
  message: string = '';
  progress: number = 100;
  private timer: any;

  constructor(private _notificationService: NotificationService) {
    this._notificationService.message$.subscribe(msg => {
      this.message = msg;
      this.progress = 100;
      if (this.timer) clearTimeout(this.timer);
      this.startTimer();
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.progress -= 1;
      if (this.progress <= 0) {
        this.clear();
      }
    }, 50); // 5-second duration
  }

  clear() {
    this.message = '';
    this.progress = 100;
    if (this.timer) clearInterval(this.timer);
    this._notificationService.clearMessage();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
