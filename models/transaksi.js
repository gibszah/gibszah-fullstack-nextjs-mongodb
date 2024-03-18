import mongoose, { Schema } from "mongoose";

const transSchema = new Schema(
  {
    name: String,
    price: String,
    jumlah: String,
    user: String,
    jam: String,
    faktur: String,
    customerBayars: Number,
    kembalian: String,
  },
  {
    timestamps: true,
  }
);

transSchema.index({ name: 1, price: 1 });
const Transaksi =
  mongoose.models.Transaksi || mongoose.model("Transaksi", transSchema);

export default Transaksi;
