import mongoose, { Schema } from "mongoose";

const pengeSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    user: String,
    jam: String,
    faktur: String,
  },
  {
    timestamps: true,
  }
);

const Pengeluaran =
  mongoose.models.Pengeluaran || mongoose.model("Pengeluaran", pengeSchema);

export default Pengeluaran;
