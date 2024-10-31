import mongoose from 'mongoose';
import { ProductDocument } from '../types/products.type';
import { getNextSequenceValue } from '../controller/counter.controller';

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
      default: async function () {
        return await getNextSequenceValue('productId');
      },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);

export default ProductModel;
