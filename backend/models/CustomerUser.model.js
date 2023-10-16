import mongoose from "mongoose";

const CustomerUserSchema = mongoose.Schema(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const CustomerUser = mongoose.model("CustomerUser", CustomerUserSchema);
export default CustomerUser;
