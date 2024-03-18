import startDb from "@/lib/db";
import Transaksi from "@/models/transaksi";
import { NextResponse } from "next/server";

export async function POST(request) {
  // try {
  //   const { transaksiItems, jam, customerBayars } = await request.json();
  //   console.log("Received data from the front-end:");

  //   await startDb();
  //   await Promise.all(
  //     transaksiItems.map(async (item) => {
  //       const { name, price, jumlah, user, faktur, customerBayars, kembalian } =
  //         item;
  //       await Transaksi.create({
  //         name,
  //         price,
  //         jumlah,
  //         user,
  //         jam,
  //         faktur,
  //         customerBayars,
  //         kembalian,
  //       });
  //     })
  //   );

  //   return NextResponse.json(
  //     { message: "Transaksi telah dibuat" },
  //     { status: 201 }
  //   );
  // } catch (error) {
  //   console.error("Failed to create data transaksi:", error);
  //   return NextResponse.json(
  //     { error: "Failed to create data transaksi" },
  //     { status: 500 }
  //   );
  // }

  try {
    const { transaksiItems, jam, customerBayars } = await request.json();
    console.log("Received data from the front-end:");

    await startDb();

    for (const item of transaksiItems) {
      // Buat patokan dengan menggabungkan nama item dan jam transaksi
      const patokan = `${item.name}-${jam}`;

      // Cek apakah transaksi dengan patokan yang sama sudah ada dalam database
      const existingTransaction = await Transaksi.findOne({ patokan });
      if (existingTransaction) {
        console.log(
          `Transaksi dengan patokan ${patokan} sudah ada dalam database.`
        );
        continue; // Lanjutkan ke transaksi berikutnya jika transaksi sudah ada
      }

      // Buat transaksi baru jika belum ada transaksi dengan patokan yang sama
      const { name, price, jumlah, user, faktur, customerBayars, kembalian } =
        item;
      await Transaksi.create({
        name,
        price,
        jumlah,
        user,
        jam,
        faktur,
        customerBayars,
        kembalian,
        patokan, // Sertakan patokan sebagai bagian dari data transaksi
      });
    }

    return NextResponse.json(
      { message: "Transaksi telah dibuat" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create data transaksi:", error);
    return NextResponse.json(
      { error: "Failed to create data transaksi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await startDb();

  const transaksis = await Transaksi.find();

  return NextResponse.json({ transaksis });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await startDb();
  await Transaksi.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Data transaksi dihapus" },
    { status: 200 }
  );
}
