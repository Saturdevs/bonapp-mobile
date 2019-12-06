import { Order } from './order';

export class MercadoPagoPayment{
    payment: any;
    order: Order;
    paymentAmount: number;
    unblockUsers: boolean;
} 