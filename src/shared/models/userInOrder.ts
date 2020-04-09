import { ProductInUserOrder, PaymentInUserOrder } from '../index';

export class UserInOrder {
  /**Id del usuario */
  name: string;
  lastName: string;
  username: string;
  products: Array<ProductInUserOrder>;
  totalPerUser: number;
  payments: Array<PaymentInUserOrder>;
  owner: Boolean;
  blocked : Boolean;
  clientId? : string;
}