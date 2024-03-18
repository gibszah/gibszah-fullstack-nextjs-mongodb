import mongoose, { Schema } from "mongoose";

import Brand from "./brand";
import Obat from "./obatname";

const topicSchema = new Schema(
  {
    pbf: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    faktur: String,
    type: String,
    buy: Number,
    sell: Number,
    description: String,
    user: String,
    stok: Number,
    ecer: Number,
    tgldatang: String,
    liability: Number,
    liadate: String,
    remark: String,
    jenis: String,
    namaobat: { type: mongoose.Schema.Types.ObjectId, ref: "Obat" },
    merk: Number,
    stokecer: Number,
    satuanecer: String,
    grosir: Number,
  },
  {
    timestamps: true,
  }
);

topicSchema.index({ namaobat: 1, ecer: 1 });

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

export default Topic;
