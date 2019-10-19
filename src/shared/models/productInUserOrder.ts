import { ProductOption } from './productOption';

export class ProductInUserOrder {
  /**Id del producto */
  product: string;
  name: string;
  options: Array<ProductOption>;
  price: number;
  size: any;   
  observations: string;
  quantity: number;
  deleted: boolean;
  deletedReason: string;

  constructor() {
    this.product = null;
    this.name = null;
    this.options = [];
    this.price = null;
    this.size = null;
    this.observations = null;
    this.quantity = null;
    this.deleted = null;
    this.deletedReason = null;
  }
}