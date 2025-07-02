'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5efe6] px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-[#265c8f]">Your Health. Your Space. Our Care.</h1>
          <p className="text-[#7895b2] text-sm max-w-md mx-auto">
            We understand it’s not always easy to talk about personal health issues. That’s why we offer private, judgment-free online consultations — so you feel heard and supported.
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link href="/consultations/new">
              <Button className="bg-[#265c8f] text-white hover:bg-[#1f4c75] rounded-xl">
                Start Your Consultation
              </Button>
            </Link>
            <Link href="/consultations">
              <Button variant="outline" className="rounded-xl border-[#265c8f] text-[#265c8f]">
                View My Consultations
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-[#265c8f]">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="bg-white rounded-xl shadow-sm border-[#e8dfca]">
              <CardContent className="p-6 text-center space-y-2">
                <h3 className="font-semibold text-lg text-[#265c8f]">1. Share What’s Going On</h3>
                <p className="text-sm text-[#444]">
                  Describe your symptoms in your own words. No need for medical jargon — just be yourself.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border-[#e8dfca]">
              <CardContent className="p-6 text-center space-y-2">
                <h3 className="font-semibold text-lg text-[#265c8f]">2. Choose Your Doctor & Pay</h3>
                <p className="text-sm text-[#444]">
                  Pick a doctor who feels right for you. Make a secure ₹500 payment to start the process.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm border-[#e8dfca]">
              <CardContent className="p-6 text-center space-y-2">
                <h3 className="font-semibold text-lg text-[#265c8f]">3. Get a Personal Response</h3>
                <p className="text-sm text-[#444]">
                  Your doctor will review your concern and reply within hours. Follow-ups are included.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section className="text-center text-sm text-[#7895b2] space-y-2 mt-10 px-2">
          <p>
            Aries OB-GYN Online Clinic is led by <strong>Dr. Madhumita Das Mazumdar</strong>, Senior Consultant Gynecologist with over 30 years of experience.
          </p>
          <p>
            We offer expert, compassionate care for periods, PCOS, fertility, menopause, and other women’s health concerns — wherever you are.
          </p>
          <p className="italic text-xs mt-1">Private. Convenient. Trusted.</p>
        </section>
      </div>
    </div>
  );
}
