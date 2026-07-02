import { NextResponse } from "next/server";
import { getMockTicketByToken, updateMockOrderStatus } from "@/lib/mock-store";

export async function POST(request: Request) {
  const { token } = await request.json();

  const order = getMockTicketByToken(token);
  if (!order) return NextResponse.json({ error: "Invalid ticket" }, { status: 404 });

  if (order.status === "CHECKED_IN") {
    return NextResponse.json({ error: "Already checked in" }, { status: 409 });
  }

  console.log("[MOCK] Check-in for ticket", token);
  updateMockOrderStatus(order.id, "CHECKED_IN");

  return NextResponse.json({
    ok: true,
    ticket: {
      id: order.id,
      ticketType: order.ticketType,
      guestName: order.guestName,
      status: "CHECKED_IN",
    },
  });
}
