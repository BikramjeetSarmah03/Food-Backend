import mongoose, { Schema, Document } from "mongoose";

interface FoodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: string;
  price: number;
  rating: number;
  images: [string];
}

const foodSchema = new Schema<FoodDoc>(
  {
    vendorId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    foodType: {
      type: String,
      required: true,
    },
    readyTime: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
    },
    images: {
      type: [String],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Food = mongoose.model<FoodDoc>("food", foodSchema);

export default Food;
