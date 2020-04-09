import { 
    PaymentTypeMin,
    CashRegisterMin,
    Client
  } from '../index';
  
  export class Transaction {
    readonly _id: String;
    amount: number;
    paymentMethod: PaymentTypeMin;
    paymentType: string;
    cashRegister: CashRegisterMin;
    date: Date;  
    comment: String;
    deleted: Boolean;
    client: Client;
  }