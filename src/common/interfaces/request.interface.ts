import { UserDocument } from 'src/users/schemas/user.schema';

export interface IRequest {
  user: UserDocument;
  headers: {
    [key: string]: string;
  }
}