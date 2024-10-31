import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'The name field is required. Please provide your full name.',
    }),
    password: string({
      required_error: 'The password field is required. Please create a password.',
    }).min(6, 'Password must be at least 6 characters long.'),
    passwordConfirmation: string({
      required_error: 'Please confirm your password.',
    }),
    email: string({
      required_error: 'The email field is required. Please provide a valid email address.',
    }).email('The provided email is not valid. Please enter a correct email address.'),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'The passwords entered do not match. Please ensure both fields are identical.',
    path: ['passwordConfirmation'],
  }),
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirmation'>;
