import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { getMockOrders, getMockProfile, updateMockOrderStatus } from "@/lib/mock-store";

async function isAdmin(): Promise<boolean> {
  // Phase 2 mock: any authenticated user is admin
  const token = await getAuthCookie();
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const orders = getMockOrders();
  const enriched = orders.map((o) => {
    const profile = getMockProfile(o.userId);
    return {
      ...o,
      userName: profile?.name || "Neznámý",
      userEmail: "mock@example.com",
    };
  });
  return NextResponse.json(enriched);
}
