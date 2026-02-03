import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserPartial } from '../../shared/interfaces/apiresponce.interface';
import { AuthService } from '../../features/auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../shared/directives/click-outside';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { environment } from '../../../env/environment';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { NotificationInterface } from '../../shared/interfaces/notification.res.interface';

@Component({
  selector: 'app-candidate-header',
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './candidate-header.html',
  styleUrl: './candidate-header.css',
})
export class CandidateHeader implements OnInit {
  baseUrl: string = environment.cloudinaryBaseUrl;
  opendModal: string | null = null;
  isDarkMode: boolean = false;
  candidate: UserPartial | null = null;
  isNotificationModalOpen :boolean = false
  unreadMessageCount = 0;
  notificationTab: 'unread' | 'all' = 'unread';
  notifications: NotificationInterface[] =[]
  isLoaded: boolean = false;

  constructor(

    private readonly _authService: AuthService,
    private readonly _themeService: ThemeService,
    private readonly _notificationService: NotificationService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._themeService.isDarkMode$.subscribe((val) => {
      this.isDarkMode = val;
    });

    this._notificationService.unreadCount$.subscribe((count) => {
      this.unreadMessageCount = count;
      this._cdr.detectChanges();
    });

    this._notificationService.notificationList$.subscribe((list) => {
      this.notifications = list;
      this._cdr.detectChanges();
    });

    this._notificationService.loadInitialData();
    
    this._authService.isLoading$.subscribe((loaded) => {
      this.isLoaded = loaded;
      this._cdr.detectChanges();
    });

    this._authService.candidate$.subscribe({
      next: (can) => {
        console.log('candidate data in backend ',can)
        this.candidate = can;
        this._cdr.detectChanges();
      },
    });
  }


  logOut(user: string) {
    this._authService.logoutUser(user);
  }

  toggleModal(id: string): void {
    this.opendModal = this.opendModal === id ? null : id;
  }

  isModalOpen(id: string): boolean {
    return this.opendModal === id;
  }

  closeModal(): void {
    this.opendModal = null;
    this.isNotificationModalOpen = false;
    this._cdr.detectChanges();
  }

  toggleDarkMode() {
    this._themeService.toggleDarkMode();
  }

  openNotificationModal(){
    console.log('works')
    this.isNotificationModalOpen = this.isNotificationModalOpen ? false : true
  }

  markAllAsRead() {
    this._notificationService.markAllAsRead().subscribe({
      next: () => {
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error marking all as read:', err);
      }
    });
  }

  markAsRead(notificationId: string) {
    this._notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error marking notification as read:', err);
      }
    });
  }

  onNotificationClick(notification: NotificationInterface) {
    if (!notification.isRead) {
      this.markAsRead(notification._id);
    }
  }

  getFilteredNotifications() {
    if (this.notificationTab === 'unread') {
      return this.notifications.filter(n => !n.isRead);
    }
    return this.notifications;
  }

  getNotificationIcon(type: string, notificationType?: string): string {
    const icons: { [key: string]: string } = {
      'RESCHEDULED': 'fa-calendar-alt',
      'SCHEDULED': 'fa-calendar-check',
      'CANCELLED': 'fa-calendar-times',
      'APPLICATION': 'fa-file-alt',
      'APPLICATION_SUBMITTED': 'fa-file-signature',
      'MESSAGE': 'fa-envelope',
      'REMINDER': 'fa-bell',
      'default': 'fa-info-circle'
    };
    return icons[type] || icons[notificationType || ''] || icons['default'];
  }

  getRelativeTime(date: string | Date | undefined, id?: string): string {
    let notificationDate: Date;

    if (date) {
      notificationDate = new Date(date);
    } else if (id && id.length === 24) {
      // Extract timestamp from MongoDB ObjectId
      const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
      notificationDate = new Date(timestamp);
    } else {
      return 'Unknown time';
    }

    const now = new Date();
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return notificationDate.toLocaleDateString();
  }
}
