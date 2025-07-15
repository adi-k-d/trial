import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text } = await req.json();

    if (!to || !subject || !text) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const response = await resend.emails.send({
      from: 'noreply@ariesobgynclinic.com',
      to,
      subject,
      text,
    });

    return NextResponse.json({ success: true, response });
  } catch (error: unknown) {
    console.error('Email error:', error);

    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
