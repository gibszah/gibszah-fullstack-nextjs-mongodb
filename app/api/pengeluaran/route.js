import startDb from "@/lib/db";
import Pengeluaran from "@/models/pengeluaran";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, price, description, user, jam, faktur } =
      await request.json();
    console.log("Received data from the front-end:", {
      name,
      price,
      description,
      user,
      jam,
      faktur,
    });

    await startDb();

    // Assuming Pengeluaran.create is a valid method for creating expenses
    await Pengeluaran.create({
      name,
      price,
      description,
      user,
      jam,
      faktur,
    });

    return NextResponse.json(
      { message: "Pengeluaran telah dibuat" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create data pengeluaran:", error);
    return NextResponse.json(
      { error: "Failed to create data pengeluaran" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await startDb();
  try {
    const pengeluaran = await Pengeluaran.find();
    return NextResponse.json({ pengeluaran });
  } catch (error) {
    console.error({ message: "Internal server error" });
  }
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await startDb();
  await Pengeluaran.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Data transaksi dihapus" },
    { status: 200 }
  );
}
