import mongoose from "mongoose";

const orderHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);
export default OrderHistory;
