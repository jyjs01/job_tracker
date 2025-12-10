import { ObjectId } from "mongodb";

export interface UserDocument {
  _id?: ObjectId;        
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}
