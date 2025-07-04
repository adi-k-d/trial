'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2 } from 'lucide-react';

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  experience_years: number;
  languages: string[];
  profile_picture_url: string | null;
};

// Razorpay global typing
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export default function StartConsultationForm() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        /*.eq('is_available', true);*/

      if (error) {
        console.error('Error loading doctors:', error);
      } else {
        setDoctors(data);
      }
    };

    loadDoctors();
  }, [supabase]);

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    const errors: { [key: string]: string } = {};

    if (!title.trim()) errors.title = 'Please enter a short summary.';
    if (!description.trim()) errors.description = 'Please describe your symptoms.';
    if (!doctorId.trim()) errors.doctor = 'Please select a doctor.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setFieldErrors({});

    const res = await loadRazorpay();
    if (!res) {
      alert('Failed to load Razorpay SDK');
      setLoading(false);
      return;
    }

    const razorpayOptions: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: 50000,
      currency: 'INR',
      name: 'Dr Madhumita Mazumdar',
      description: 'Online Consultation Payment',
      image: '/logo.png',
      handler: async (response) => {
        const { razorpay_payment_id } = response;

        const { data, error } = await supabase
          .from('consultations')
          .insert([
            {
              patient_id: user?.id,
              title,
              description,
              doctor_id: doctorId,
              razorpay_payment_id,
              status: 'pending',
            },
          ])
          .select()
          .single();

        if (error) {
          alert('Error saving consultation.');
          console.error(error);
          setLoading(false);
          return;
        }

        router.push(`/consultations/${data.id}`);
      },
      prefill: {
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        contact: '',
      },
      theme: { color: '#265c8f' },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg rounded-2xl shadow-md border-none bg-white">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold text-[#265c8f]">Tell us what&apos;s bothering you</h1>
            <p className="text-sm text-[#7895b2]">
              Fill in a quick summary and choose a doctor who fits your needs.
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#265c8f] font-medium">
              Issue Summary
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lower abdominal pain"
              className={`rounded-xl border ${
                fieldErrors.title ? 'border-red-500' : 'border-[#e8dfca]'
              } focus:border-[#265c8f]`}
            />
            {fieldErrors.title && <p className="text-xs text-red-500">{fieldErrors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#265c8f] font-medium">
              Details
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your symptoms..."
              className={`rounded-xl border ${
                fieldErrors.description ? 'border-red-500' : 'border-[#e8dfca]'
              } focus:border-[#265c8f]`}
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-500">{fieldErrors.description}</p>
            )}
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
          <Label htmlFor="doctor" className="text-[#265c8f] font-medium">
            Choose a Doctor
          </Label>
          <select
            id="doctor"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#265c8f] ${
              fieldErrors.doctor ? 'border-red-500' : 'border-[#e8dfca]'
            } focus:outline-none focus:ring-2 focus:ring-[#265c8f]`}
          >
            <option value="">-- Select a doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.specialization}
              </option>
            ))}
          </select>
          {fieldErrors.doctor && <p className="text-xs text-red-500">{fieldErrors.doctor}</p>}
        </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-[#265c8f] text-white hover:bg-[#1f4c75] rounded-xl py-6 text-base font-medium"
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
