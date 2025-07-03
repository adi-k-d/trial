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
        .eq('is_available', true);

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

    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: 50000,
      currency: 'INR',
      name: 'Dr Madhumita Mazumdar',
      description: ' Online Consultation Payment',
      image: '/logo.png',
      handler: async (response: { razorpay_payment_id: string }) => {
        const { razorpay_payment_id } = response;
        console.log(response)

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

    const razorpay = new (window as any).Razorpay(razorpayOptions);
    razorpay.open();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg rounded-2xl shadow-md border-none bg-white">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold text-[#265c8f]">Tell us what's bothering you</h1>
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
            <Label className="text-[#265c8f] font-medium">Choose a Doctor</Label>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {doctors.map((doctor) => {
                const isSelected = doctorId === doctor.id;
                return (
                  <div
                    key={doctor.id}
                    onClick={() => setDoctorId(doctor.id)}
                    className={`relative flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#e8dfca] border-[#265c8f]'
                        : 'bg-white border-[#eee] hover:bg-[#f9f6f1]'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2
                        className="absolute top-2 right-2 text-green-600"
                        size={20}
                      />
                    )}
                    <Avatar>
                      <AvatarImage src={doctor.profile_picture_url || ''} />
                      <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-[#265c8f]">{doctor.name}</p>
                      <p className="text-sm text-gray-600">
                        {doctor.specialization} · {doctor.experience_years}+ yrs
                      </p>
                      <p className="text-xs text-gray-500">{doctor.qualifications}</p>
                      <p className="text-xs text-gray-500">
                        Languages: {doctor.languages?.join(', ')}
                      </p>
                    </div>
                  </div>
                );
              })}
              {doctors.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No doctors are currently available.
                </p>
              )}
              {fieldErrors.doctor && <p className="text-xs text-red-500">{fieldErrors.doctor}</p>}
            </div>
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
