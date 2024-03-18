import mongoose, { Schema } from "mongoose";

const fakturSchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

const Faktur = mongoose.models.Faktur || mongoose.model("Faktur", fakturSchema);

export default Faktur;
