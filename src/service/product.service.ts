import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import ProductModel from '../models/product.model';
import { ProductDocument, ProductInput } from '../types/products.type';

export async function createProduct(input: Omit<ProductInput, 'createdAt' | 'updatedAt'>) {
  return ProductModel.create(input);
}

export async function findProduct(query: FilterQuery<ProductDocument>, options: QueryOptions = { lean: true }) {
  return ProductModel.findOne(query, {}, options);
}

export async function findAndUpdateProduct(query: FilterQuery<ProductDocument>, update: UpdateQuery<ProductDocument>, options: QueryOptions) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
  return ProductModel.deleteOne(query);
}
