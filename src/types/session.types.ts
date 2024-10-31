import mongoose from "mongoose";
import { UserDocument } from "./user.types";

export interface Session {
  _id: string;
  user: string;
  valid: boolean;
}

export interface SessionDocument extends mongoose.Document {
  user: UserDocument["_id"];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}