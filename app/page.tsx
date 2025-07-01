'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">Welcome to Aries Obgyn Clinic</h1>
        <p className="text-gray-600">Expert gynecological care from the comfort of your home</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/consultations/new">
            <Button>Start a Consultation</Button>
          </Link>
          <Link href="/consultations">
            <Button variant="outline">My Consultations</Button>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-center">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-lg mb-2">1. Share Your Concern</h3>
              <p className="text-sm text-muted-foreground">
                Fill a simple form describing your health issue. Your privacy is fully protected.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-lg mb-2">2. Make a Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Pay ₹500 securely using UPI. No hidden charges.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <h3 className="font-semibold text-lg mb-2">3. Get Personalized Advice</h3>
              <p className="text-sm text-muted-foreground">
                The doctor reviews your concern and replies within a few hours. Follow-ups included.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center text-sm text-muted-foreground mt-10">
        <p>Aries OB-GYN Online Clinic is led by Dr. Madhumita Mazumdar, Senior Consultant Gynecologist with 30+ years of experience in women&apos;s health.</p>
        <p className="mt-1">Safe, private and convenient consultations for PCOS, periods, fertility, menopause & more.</p>
      </section>
    </div>
  );
}