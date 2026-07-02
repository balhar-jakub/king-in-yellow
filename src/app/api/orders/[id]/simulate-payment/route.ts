import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { getMockOrderById, updateMockOrderStatus } from "@/lib/mock-store";

async function getUserId(): Promise<string | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.sub || null;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = getMockOrderById(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (order.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  console.log("[MOCK] Payment simulated for order", params.id);
  updateMockOrderStatus(params.id, "CONFIRMED");

  return NextResponse.json({ ok: true });
}
