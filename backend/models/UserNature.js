import mongoose from "mongoose";

const UserNatureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    nature: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserNature = mongoose.model("UserNature", UserNatureSchema);
export default UserNature;
