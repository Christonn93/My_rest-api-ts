import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import { UserDocument } from '../types/user.types';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  const user = this as unknown as UserDocument;

  if (!user.isModified('password')) return next(); // Call next if password is not modified

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

// Export the model
export const UserModel = mongoose.model<UserDocument>('User', userSchema);
