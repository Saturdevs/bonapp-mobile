import { 
  CashRegister,
  User,
  OrderDiscount,
  UserInOrder
} from '../index';

export class Order {
  _id: string;
  orderNumber: number;
  type: string;
  table: number;
  /**Va a ser la caja por default ya que el usuario que realiza el pedido
   * no puede elegir una caja del bar
   */
  cashRegister: CashRegister;
  waiter: User;
  status: string;
  app: Boolean;
  users: Array<UserInOrder>;
  created_at: Date;
  sent_at: Date;
  completed_at: Date;
  discount: OrderDiscount;
  totalPrice: number;
}