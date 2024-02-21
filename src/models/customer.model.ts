import mongoose, { Document, Schema } from "mongoose";

interface CustomerDoc extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  salt: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
}

const customerSchema = new Schema<CustomerDoc>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean, default: false },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
  }
);

const Customer = mongoose.model<CustomerDoc>("customer", customerSchema);

export default Customer;
