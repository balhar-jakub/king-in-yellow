import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { getMockOrderById, updateMockOrderStatus } from "@/lib/mock-store";

async function isAdmin(): Promise<boolean> {
  const token = await getAuthCookie();
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const order = getMockOrderById(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  console.log("[MOCK] Admin confirmed payment for order", params.id);
  updateMockOrderStatus(params.id, "CONFIRMED");

  return NextResponse.json({ ok: true });
}
