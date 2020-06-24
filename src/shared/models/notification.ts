import { NotificationType, UserTo, NotificationReadBy } from './index'
import { NotificationData } from './notificationData';

export class Notification {
    notificationType: string;
    table: Number;
    orderId?: string;
    userFrom: string;
    usersTo: Array<UserTo>;
    createdAt: Date;
    readBy: Array<NotificationReadBy>;
    data: NotificationData;
    actions: Array<any>;    
}