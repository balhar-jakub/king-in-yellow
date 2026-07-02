import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { createMockOrder, getMockOrderByUser } from "@/lib/mock-store";

async function getUserId(): Promise<string | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.sub || null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = getMockOrderByUser(userId);
  return NextResponse.json(order || null);
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ticketType, guestName } = await request.json();

  const priceMap: Record<string, number> = {
    EARLY_BIRD: 777,
    REGULAR: 888,
    COUPLE: 1776,
  };
  const amount = priceMap[ticketType] || 0;
  if (!amount) {
    return NextResponse.json({ error: "Invalid ticket type" }, { status: 400 });
  }

  const order = createMockOrder(userId, ticketType, amount, guestName || undefined);
  console.log("[MOCK] Order created:", order);
  return NextResponse.json(order, { status: 201 });
}
