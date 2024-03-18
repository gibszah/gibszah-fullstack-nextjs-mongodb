import startDb from "@/lib/db";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";
import { authenticateToken } from "@/components/auth/middleware";
import Obat from "@/models/obatname";

export async function POST(request) {
  try {
    const {
      pbfId,
      faktur,
      type,
      buy,
      sell,
      description,
      user,
      stok,
      ecer,
      tgldatang,
      liability,
      liadate,
      remark,
      jenis,
      namaobatId,
      merk,
      stokecer,
      satuanecer,
      grosir,
    } = await request.json();
    console.log("Received data from the front-end:");

    await startDb();
    await Topic.create({
      pbf: pbfId,
      faktur,
      type,
      buy,
      sell,
      description,
      user,
      stok,
      ecer,
      tgldatang,
      liability,
      liadate,
      remark,
      jenis,
      namaobat: namaobatId,
      merk,
      stokecer,
      satuanecer,
      grosir,
    });

    return NextResponse.json(
      { message: "Data Obat telah di buat" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create data:", error);
    return NextResponse.json(
      { error: "Failed to create data" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  // const { authenticated, user } = await authenticateToken(request);

  // if (!authenticated) {
  //   return NextResponse.json(
  //     { error: "Unauthorized (Anda tidak memiliki ijin.)" },
  //     { status: 401 }
  //   );
  // }
  await startDb();
  try {
    const topics = await Topic.find().populate("pbf").populate("namaobat");

    return NextResponse.json({ topics });
  } catch (error) {
    console.error({ message: "Internal server error" });
  }

  /////
  // try {
  // const { searchQuery } = request.params; // Ambil parameter pencarian dari permintaan

  // if (searchQuery) {
  //   const obat = await Obat.findOne({ name: searchQuery }).exec();

  //   if (obat) {
  //     // Jika obat ditemukan, mencari topik berdasarkan ID obat yang ditemukan
  //     const topics = await Topic.find({ namaobat: obat._id })
  //       .populate("pbf")
  //       .exec();

  //     return NextResponse.json({ topics });
  //   } else {
  //     // Jika obat tidak ditemukan, kembalikan pesan bahwa obat tidak ditemukan
  //     return NextResponse.json({ message: "Obat tidak ditemukan" });
  //   }
  // } else {
  //   // Jika tidak ada parameter pencarian, ambil semua data topik
  //   const topics = await Topic.find().populate("pbf").populate("namaobat");

  //   return NextResponse.json({ topics });
  // }
  // } catch (error) {
  //   console.error({ message: "Internal server error" });
  // }
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await startDb();
  await Topic.findByIdAndDelete(id);
  return NextResponse.json({ message: "Data obat dihapus" }, { status: 200 });
}
