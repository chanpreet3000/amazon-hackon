import mongoose from "mongoose";

const userBotFeedback = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    conversations: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserBotFeedback = mongoose.model("UserBotFeedback", userBotFeedback);
export default UserBotFeedback;
