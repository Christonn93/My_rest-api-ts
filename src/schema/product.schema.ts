import { object, number, string, TypeOf } from "zod";

const payload = {
  body: object({
    title: string({
      required_error: "The title field is required. Please provide a title for the product.",
    }),
    description: string({
      required_error: "The description field is required. Please provide a detailed description of the product.",
    }).min(120, "The description must be at least 120 characters long to ensure adequate detail."),
    price: number({
      required_error: "The price field is required. Please specify the product's price.",
    }),
    image: string({
      required_error: "The image field is required. Please provide a valid image URL.",
    }),
    productId: number().optional(),
  }),
};

const params = {
  params: object({
    productId: string({
      required_error: "The product ID is required. Please provide a valid product ID.",
    }),
  }),
};

export const createProductSchema = object({
  ...payload,
});

export const updateProductSchema = object({
  ...payload,
  ...params,
});

export const deleteProductSchema = object({
  ...params,
});

export const getProductSchema = object({
  ...params,
});

export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type ReadProductInput = TypeOf<typeof getProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;
