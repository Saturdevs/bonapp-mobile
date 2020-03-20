import { NotificationType, UserTo, NotificationReadBy } from './index'

export class Notification {
    notificationType: NotificationType;
    table: Number;
    userFrom: string;
    usersTo: Array<UserTo>;
    createdAt: Date;
    readBy: Array<NotificationReadBy>;
}