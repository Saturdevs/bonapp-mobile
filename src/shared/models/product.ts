import { ProductStock } from './productStock';

export class Product {
  _id: string;
  name: string;
  category: string;
  pictures: string;
  description: string;
  price: number;
  options: Array<any> = [];
  sizes: Array<any> = [];
  tags: Array<string> = [];
  available: any;
  stockControl: Boolean;
  stock: ProductStock;
}