import { Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme/theme.service';
import { SocketService } from './shared/services/socket/socket.service';
import { NotificationService } from './shared/services/notification/notification.service';
import { AuthService } from './features/auth/services/auth.service';
import { ToastComponent } from './common/toast/toast.component';
import { ConfirmModalComponent } from './common/confirm-modal/confirm-modal.component';
import { combineLatest, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _themeService:ThemeService,
    private _socketService: SocketService,
    private readonly _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this._authService.isUserLoaded
      .pipe(
        filter((loaded) => loaded),
        switchMap(() =>
          combineLatest([
            this._authService.admin$,
            this._authService.company$,
            this._authService.candidate$,
          ])
        )
      )
      .subscribe(([admin, company, candidate]) => {
        const isLoggedIn = !!admin || !!company || !!candidate;
        if (isLoggedIn) {
          this._socketService.connect();
          this._notificationService.loadInitialData();
          this._notificationService.loadUnreadCount();
          this._notificationService.listenToSocket();
        } else {
          this._notificationService.clear();
          this._socketService.disconnect();
        }
      });

  }
}
