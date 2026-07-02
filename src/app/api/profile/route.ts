import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";
import { getMockProfile, saveMockProfile } from "@/lib/mock-store";

async function getUserId(): Promise<string | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.sub || null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = getMockProfile(userId);
  return NextResponse.json(profile || { name: "", phone: "", street: "", city: "", zip: "" });
}

export async function PUT(request: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  console.log("[MOCK] Profile saved for user", userId, body);
  saveMockProfile(userId, body);
  return NextResponse.json({ ok: true });
}
