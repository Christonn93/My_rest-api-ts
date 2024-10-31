import mongoose from "mongoose";

export interface User {
  _id: string;
  email: string;
}

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserDocument extends mongoose.Document {
    _id: string; 
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}