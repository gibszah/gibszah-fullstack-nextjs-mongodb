import startDb from "/lib/db";
import Topic from "/models/topic";
import Obat from "/models/obatname";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { searchQuery } = params;
  //   const encodedSearchQuery = encodeURIComponent(searchQuery); // Encode nilai searchQuery

  try {
    await startDb();
    console.log("isinya apa", searchQuery);

    let obat;

    const regexQuery = new RegExp(searchQuery, "i");
    obat = await Obat.find({ name: { $regex: regexQuery } });

    if (!obat || obat.length === 0) {
      // obat = await Obat.find();
      return NextResponse.json({ message: "Obat not found" }, { status: 404 });
    }

    const obatId = obat.map((item) => item._id);
    // return NextResponse.json({ obat }, { status: 200 });
    console.log("apa", obatId);

    let topics;
    topics = await Topic.find({ namaobat: { $in: obatId } })
      .populate("pbf")
      .populate("namaobat");

    if (!topics || topics.length === 0) {
      topics = await Topic.find().populate("pbf").populate("namaobat");
      //   return NextResponse.json(
      //     { message: "Detail Stok Obat tidak ditemukan" },
      //     { status: 404 }
      //   );
    }

    return NextResponse.json({ topics }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
