import { object, string } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "The email field is required. Please provide a valid email address.",
    }),
    password: string({
      required_error: "The password field is required. Please enter your password.",
    }),
  }),
});
