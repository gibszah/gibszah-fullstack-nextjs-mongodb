// faktur.js

import startDb from "@/lib/db";
import Topic from "@/models/topic";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { faktur } = params;
  const { newRemark } = await request.json();

  try {
    await startDb();
    // Perbarui semua dokumen dengan faktur yang sama
    await Topic.updateMany({ faktur: faktur }, { remark: newRemark });

    return NextResponse.json(
      { message: "Status remarks telah diperbarui untuk faktur tertentu" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal memperbarui status remarks:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui status remarks" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const { faktur } = params;
  await startDb();
  const topic = await Topic.findOne({ faktur: faktur });
  return NextResponse.json({ topic }, { status: 200 });
}
