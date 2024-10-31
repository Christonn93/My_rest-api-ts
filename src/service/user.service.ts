import { FilterQuery } from 'mongoose';
import { omit } from 'lodash';
import { UserModel } from '../models/user.model';
import { UserDocument, UserInput } from '../types/user.types';
import { logger } from '../utils/logger'; // Ensure the logger is imported

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);
    logger.info(`User created successfully with email: ${input.email}`); // Info log for successful creation
    return omit(user.toJSON(), 'password');
  } catch (e: any) {
    logger.error(`Error creating user with email: ${input.email}, Error: ${e.message}`); // Error log with email
    throw new Error(`Error creating user: ${e.message}`);
  }
}

export async function validatePassword(body: { email: string; password: string }) {
  const { email, password } = body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      logger.warn(`Invalid login attempt with non-existent email: ${email}`); // Warn log for non-existent user
      return false;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      logger.warn(`Invalid password attempt for email: ${email}`); // Warn log for invalid password
      return false;
    }

    logger.info(`User validated successfully for email: ${email}`); // Info log for successful validation
    return omit(user.toJSON(), 'password');
  } catch (e: any) {
    logger.error(`Error validating password for email: ${email}, Error: ${e.message}`); // Error log for validation failure
    throw new Error(`Error validating password: ${e.message}`);
  }
}

export async function findUser(query: FilterQuery<UserDocument>) {
  try {
    const user = await UserModel.findOne(query).lean();
    logger.info(`User found with query: ${JSON.stringify(query)}`); // Info log for successful find
    return user;
  } catch (e: any) {
    logger.error(`Error finding user with query: ${JSON.stringify(query)}, Error: ${e.message}`); // Error log for find failure
    throw new Error(`Error finding user: ${e.message}`);
  }
}
