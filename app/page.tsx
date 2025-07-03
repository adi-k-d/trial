'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] px-4 md:px-6 py-12">
      <div className="max-w-screen-md mx-auto space-y-20">

        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#265c8f]">
            Expert Women&apos;s Health Care — From the Comfort of Your Home
          </h1>
          <p className="text-[#4a4a4a] text-base max-w-md mx-auto leading-relaxed">
            We understand how personal health can feel overwhelming. That&apos;s why we&apos;ve created a safe, simple, and private way for you to get answers, reassurance, and treatment — without stepping outside your home.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link href="/consultations/new">
              <Button className="rounded-xl bg-[#265c8f] text-white hover:bg-[#1f4c75] px-6 py-2 text-sm">
                Start a Consultation
              </Button>
            </Link>
            <Link href="/consultations">
              <Button
                variant="outline"
                className="rounded-xl border-[#265c8f] text-[#265c8f] hover:bg-[#e8dfca] px-6 py-2 text-sm"
              >
                View My Consultations
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-center text-[#265c8f]">
            Getting Started is Easy
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="bg-white rounded-2xl shadow-sm border border-[#e8dfca]">
              <CardContent className="p-6 text-center space-y-2">
                <h3 className="font-semibold text-lg text-[#265c8f]">1. Tell Us What&apos;s Bothering You</h3>
                <p className="text-sm text-muted-foreground">
                  Share your symptoms in plain language — no medical terms needed. Your story matters.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm border border-[#e8dfca]">
              <CardContent className="p-6 text-center space-y-2">
                <h3 className="font-semibold text-lg text-[#265c8f]">2. Select Your Doctor &amp; Pay Securely</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a trusted doctor and make a ₹500 one-time payment. No hidden charges.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm border border-[#e8dfca]">
              <CardContent className="p-6 text-center space-y-2">
                <h3 className="font-semibold text-lg text-[#265c8f]">3. Get a Personalized Response</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a thoughtful, expert reply within hours. Free follow-up included.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section className="text-center space-y-4 px-2">
          <p className="text-base text-muted-foreground leading-relaxed">
            <strong>Aries OB-GYN Online Clinic</strong> is led by{' '}
            <strong>Dr. Madhumita Das Mazumdar</strong>, a Senior Consultant Gynecologist with over 30 years of experience.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Whether it&apos;s painful periods, PCOS, fertility, menopause, or questions you&apos;re shy to ask — we&apos;re here to help you feel heard and cared for.
          </p>
          <p className="italic text-sm text-gray-500 mt-1">Trusted. Confidential. Designed for Women.</p>
        </section>
      </div>
    </div>
  );
}
