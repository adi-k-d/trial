'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

interface RazorpayInstance {
  open(): void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export default function StartConsultationForm() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [symptom, setSymptom] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    if (!symptom.trim()) {
      setError('Please describe your symptoms.');
      return;
    }

    setError('');
    setLoading(true);

    const res = await loadRazorpay();
    if (!res) {
      alert('Failed to load Razorpay SDK');
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: 50000,
      currency: 'INR',
      name: 'Consult Dr. Madhumita Mazumdar',
      description: 'Online Consultation',
      handler: async function (response: RazorpayPaymentResponse) {
        const paymentId = response.razorpay_payment_id;

        // Save to Supabase
        const { data, error } = await supabase
          .from('consultations')
          .insert([
            {
              patient_id: user?.id,
              symptom,
              details,
              razorpay_payment_id: paymentId,
              status: 'pending',
            },
          ])
          .select()
          .single();

        if (error) {
          alert('Error saving consultation. Please contact support.');
          console.error(error);
          return;
        }

        router.push(`/consultations/${data.id}`);
      },
      prefill: {
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        contact: '',
      },
      theme: {
        color: '#6366F1',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setLoading(false);
  };

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardContent className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Start a New Consultation</h1>

        <div className="space-y-2">
          <Label htmlFor="symptom">Symptom / Problem *</Label>
          <Input
            id="symptom"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="e.g. Irregular periods, pelvic pain"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="details">Additional Details (optional)</Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Duration, changes, medications, etc."
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleSubmit} className="w-full mt-2" disabled={loading}>
          {loading ? 'Processing...' : 'Pay ₹500 & Start Consultation'}
        </Button>
      </CardContent>
    </Card>
  );
}
