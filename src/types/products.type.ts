import mongoose from "mongoose";
import { UserDocument } from "./user.types";

export interface ProductInput {
  name: string;           // Ensure 'name' is defined here
  description: string;
  price: number;
  user: string; 
  productId: number;
}

export interface ProductDocument extends mongoose.Document {
  user: UserDocument['_id'];
  title: string;         // Make sure to include title if needed
  description: string;
  price: number;
  image: string;
  createdAt: Date;      // Fixed the typo from createAt to createdAt
  updatedAt: Date;
}