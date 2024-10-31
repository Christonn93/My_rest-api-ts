import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
import { omit } from 'lodash';
import { logger } from '../utils/logger';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response): Promise<void> {
  try {
    const user = await createUser(req.body);

    const response = {
      status: {
        code: 201,
        message: 'User created successfully',
      },
      name: user.name,
      email: user.email,
      id: user._id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json(response);
    logger.info('Created user successfully');
  } catch (e: any) {
    res.status(409);
    logger.error(e.message);
  }
}
