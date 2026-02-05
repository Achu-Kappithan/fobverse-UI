import { notificationType } from '../enums/notification.enum';

export interface NotificationInterface {
  _id: string;
  candidateId: string;

  type: notificationType;
  notificationType?: string; // Fallback for backend naming inconsistency

  title: string;

  message: string;

  meta?: {
    interviewId: string;
    date: string;
    time: string;
  };

  isRead: boolean;

  createdAt?: string
}
