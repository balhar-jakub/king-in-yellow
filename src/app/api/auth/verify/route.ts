import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";

const SITE_URL = process.env.SITE_URL || "https://plesvezlute.cz";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const redirect = request.nextUrl.searchParams.get("redirect") || "/nastenka";

    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?error=invalid&redirect=${encodeURIComponent(redirect)}`, SITE_URL)
      );
    }

    // Look up token
    const magicToken = await prisma.magicToken.findUnique({
      where: { token },
    });

    // Reject: not found, expired, or already used
    if (
      !magicToken ||
      magicToken.used ||
      magicToken.expiresAt < new Date()
    ) {
      return NextResponse.redirect(
        new URL(`/login?error=expired&redirect=${encodeURIComponent(redirect)}`, SITE_URL)
      );
    }

    // Mark token as used
    await prisma.magicToken.update({
      where: { id: magicToken.id },
      data: { used: true },
    });

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email: magicToken.email },
      update: { lastLogin: new Date() },
      create: { email: magicToken.email, lastLogin: new Date() },
    });

    // Sign JWT
    const jwt = await signToken({ sub: user.id, email: user.email });

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirect, SITE_URL));

    // Set auth cookie
    await setAuthCookie(response, jwt);

    return response;
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.redirect(new URL("/login?error=unknown", SITE_URL));
  }
}
