import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromWhatsapp = process.env.TWILIO_WHATSAPP_NUMBER!;

const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing "to" or "message"' },
        { status: 400 }
      );
    }

    const result = await client.messages.create({
      from: fromWhatsapp,
      to: `whatsapp:${to}`,
      body: message,
    });

    return NextResponse.json({ success: true, sid: result.sid });
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Twilio Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
