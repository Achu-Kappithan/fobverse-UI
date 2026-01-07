import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponce } from '../../interfaces/apiresponce.interface';
import { NotificationInterface } from '../../interfaces/notification.res.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  private notificationSubject = new BehaviorSubject<NotificationInterface[]>([])
  notificationList$ = this.notificationSubject.asObservable();

  constructor(
    private socketService: SocketService,
    private http: HttpClient
  ) {}

  loadUnreadCount() {
    this.http.get<ApiResponce<{ count: number }>>('/api/notification/getunreadcount')
      .subscribe(res => {
        this.unreadCountSubject.next(res.data.count);
      });
  }

  loadInitialData() {
    this.http.get<ApiResponce<NotificationInterface[]>>('/api/notification/getnotification')
      .subscribe(res => {
        console.log('fetch inital notification',res)
        this.notificationSubject.next(res.data);
      });
  }

  listenToSocket() {
    this.socketService.onNotification((notification) => {
      const currentNotifications = this.notificationSubject.value;
      this.notificationSubject.next([notification, ...currentNotifications]);
      this.incrementUnread();
    });
  }

  incrementUnread() {
    this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
  }

  resetUnread() {
    this.unreadCountSubject.next(0);
  }

  markAsRead(notificationId: string){
    return this.http.patch(`/api/notification/${notificationId}/markasread`, {}).pipe(
      tap(() => {
        const currentNotifications = this.notificationSubject.value;
        const updatedNotifications = currentNotifications.map(notif =>
          notif._id === notificationId
            ? { ...notif, isRead: true }
            : notif
        );
        this.notificationSubject.next(updatedNotifications);
        this.updateUnreadCount(updatedNotifications);
      })
    );
  }

  markAllAsRead(){
    return this.http.patch(`/api/notification/markallread`, {}).pipe(
      tap(() => {
        const currentNotifications = this.notificationSubject.value;
        const updatedNotifications = currentNotifications.map(notif => ({
          ...notif,
          isRead: true
        }));
        this.notificationSubject.next(updatedNotifications);
        this.updateUnreadCount(updatedNotifications);
      })
    );
  }

  private updateUnreadCount(notifications: NotificationInterface[]): void {
    const unreadCount = notifications.filter(notif => !notif.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }
}
