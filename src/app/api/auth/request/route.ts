import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, redirect } = await request.json();

    // Basic email validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ ok: true }); // Don't leak info
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Invalidate previous unused tokens for this email
    await prisma.magicToken.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    // Generate token
    const token = crypto.randomUUID() + crypto.randomBytes(32).toString("hex");

    // Store token (15 min expiry)
    await prisma.magicToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // Send email
    await sendMagicLinkEmail(
      normalizedEmail,
      token,
      redirect || undefined
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Auth request error:", error);
    return NextResponse.json({ ok: true }); // Always return ok
  }
}
