import { NextResponse } from "next/server";
import { getMockTicketByToken } from "@/lib/mock-store";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  const order = getMockTicketByToken(params.token);
  if (!order) return NextResponse.json({ error: "Invalid ticket" }, { status: 404 });

  return NextResponse.json({
    id: order.id,
    ticketType: order.ticketType,
    amount: order.amount,
    status: order.status,
    guestName: order.guestName,
    createdAt: order.createdAt,
  });
}
