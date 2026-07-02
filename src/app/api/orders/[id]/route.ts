import { NextResponse } from "next/server";
import { getMockOrderById } from "@/lib/mock-store";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const order = getMockOrderById(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(order);
}
