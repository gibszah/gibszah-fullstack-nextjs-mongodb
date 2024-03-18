import mongoose, { Schema } from "mongoose";

const obatSchema = new Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

const Obat = mongoose.models.Obat || mongoose.model("Obat", obatSchema);

export default Obat;
