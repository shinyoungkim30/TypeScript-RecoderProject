import IUser from '../models/user';

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      file: File;
    }
    interface File {
      filename: string;
    }
  }
}