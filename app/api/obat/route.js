import startDb from "@/lib/db";
import Obat from "@/models/obatname";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name } = await request.json();
    console.log("Received data from the front-end:");

    await startDb();
    await Obat.create({
      name,
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

export async function GET() {
  await startDb();
  const obats = await Obat.find();

  return NextResponse.json({ obats });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await startDb();
  await Obat.findByIdAndDelete(id);
  return NextResponse.json({ message: "Data obat dihapus" }, { status: 200 });
}
