import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { to } = await request.json();

    const info = await sendEmail({
      to,
      subject: "Test — Ve Žluté",
      html: `
        <div style="background:#0a0a0a; color:#d4cfc4; padding:40px; font-family:Georgia,serif; max-width:500px; margin:0 auto; border:1px solid #ddad31;">
          <h1 style="color:#ddad31; text-align:center;">Ve Žluté</h1>
          <p>Toto je testovací e-mail z plesového webu.</p>
          <p style="color:#ddad31;">Pokud toto čtete, e-maily fungují správně.</p>
          <hr style="border-color:#ddad31; border-width:1px 0 0 0;" />
          <p style="color:#9a9484; font-size:12px; text-align:center;">
            — Ve Žluté, 20. 2. 2027, Plzeň —
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Test email failed:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
