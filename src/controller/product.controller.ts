import { Request, Response } from 'express';
import { CreateProductInput, UpdateProductInput } from '../schema/product.schema';
import { createProduct, deleteProduct, findAndUpdateProduct, findProduct } from '../service/product.service';
import { logger } from '../utils/logger';
import { getNextSequenceValue } from './counter.controller';

export async function createProductHandler(req: Request<{}, {}, CreateProductInput['body']>, res: Response): Promise<void> {
  const userId = res.locals.user._id;
  const body = req.body;

  try {
    // Get the next product ID
    const productId = await getNextSequenceValue('productId'); // Await the async function

    // Create the product
    const product = await createProduct({
      ...body,
      user: userId,
      productId,
      name: body.title,
    });

    logger.info(`Product created successfully for user: ${userId}, Product ID: ${product._id}`);
    res.send(product);
  } catch (error) {
    logger.error(`Error creating product for user: ${userId}, Error: ${error}`);
    res.status(500).json({ message: 'Failed to create product' });
  }
}

export async function updateProductHandler(req: Request<UpdateProductInput['params']>, res: Response): Promise<void> {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;

  try {
    const product = await findProduct({ productId });

    if (!product) {
      logger.warn(`Product not found for update, Product ID: ${productId}`);
      res.sendStatus(404);
      return;
    }

    if (String(product.user) !== userId) {
      logger.warn(`Unauthorized product update attempt by user: ${userId} for Product ID: ${productId}`);
      res.sendStatus(403);
      return;
    }

    const updatedProduct = await findAndUpdateProduct({ productId }, update, {
      new: true,
    });

    logger.info(`Product updated successfully, Product ID: ${productId}`);
    res.send(updatedProduct);
    return;
  } catch (error) {
    logger.error(`Error updating product, Product ID: ${productId}, Error: ${error}`);
    res.status(500).json({ message: 'Failed to update product' });
    return;
  }
}

export async function getProductHandler(req: Request<UpdateProductInput['params']>, res: Response): Promise<void> {
  const productId = req.params.productId;

  try {
    const product = await findProduct({ productId });

    if (!product) {
      logger.warn(`Product not found, Product ID: ${productId}`);
      res.sendStatus(404);
      return;
    }

    logger.info(`Product retrieved successfully, Product ID: ${productId}`);
    res.send(product);
    return;
  } catch (error) {
    logger.error(`Error retrieving product, Product ID: ${productId}, Error: ${error}`);
    res.status(500).json({ message: 'Failed to retrieve product' });
    return;
  }
}

export async function deleteProductHandler(req: Request<UpdateProductInput['params']>, res: Response): Promise<void> {
  const userId = res.locals.user._id;
  const productId = req.params.productId;

  try {
    const product = await findProduct({ productId });

    if (!product) {
      logger.warn(`Product not found for deletion, Product ID: ${productId}`);
      res.sendStatus(404);
      return;
    }

    if (String(product.user) !== userId) {
      logger.warn(`Unauthorized product deletion attempt by user: ${userId} for Product ID: ${productId}`);
      res.sendStatus(403);
      return;
    }

    await deleteProduct({ productId });
    logger.info(`Product deleted successfully, Product ID: ${productId}`);
    res.sendStatus(200);
    return;
  } catch (error) {
    logger.error(`Error deleting product, Product ID: ${productId}, Error: ${error}`);
    res.status(500).json({ message: 'Failed to delete product' });
    return;
  }
}
