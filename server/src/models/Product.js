import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    categoryName: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    badge: { type: String, default: null },
    featured: { type: Boolean, default: false, index: true },
    bestseller: { type: Boolean, default: false, index: true },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    specs: {
      type: [{ label: String, value: String, _id: false }],
      default: [],
    },
  },
  { timestamps: true },
);

productSchema.virtual('image').get(function image() {
  return this.images?.[0] ?? '';
});

productSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret.slug;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Product', productSchema);
