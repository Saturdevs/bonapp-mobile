export class Product {
  name: string;
  category: string;
  pictures: Array<string> = [];
  description: string;
  price: number;
  options: Array<any> = [];
  sizes: Array<any> = [];
  tags: Array<string> = []
}