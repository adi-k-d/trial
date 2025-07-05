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
  } catch (error: any) {
    console.error('Twilio Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 