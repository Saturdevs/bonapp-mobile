export class Order {
  _id: string;
  created_at: string;
  table: number;
  open: boolean;
  cancel: boolean;
  //users
  completed_at: string;
  totalPrice: number;
}