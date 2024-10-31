import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void  => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      res.status(400).send(e.errors);
    }
  };

