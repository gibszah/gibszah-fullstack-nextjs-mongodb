import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", topicSchema);

export default Notification;
