import { OpenOrderForUser } from './index';


export class User {
  _id: string;
  name: string;
  lastname: string;
  username: string;
  phone: string;
  email: string;
  roleId: string;
  token: string;
  openOrder: OpenOrderForUser;
}