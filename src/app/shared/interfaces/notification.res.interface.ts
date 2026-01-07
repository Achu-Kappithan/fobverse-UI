import { notificationType } from '../enums/notification.enum';

export interface NotificationInterface {
  _id: string;
  candidateId: string;

  type: notificationType;

  title: string;

  message: string;

  meta?: {
    interviewId: string;
    date: string;
    time: string;
  };

  isRead: boolean;

  createdAt: string
}
