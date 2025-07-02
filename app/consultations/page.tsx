'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Consultation = {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
};

export default function MyConsultationsPage() {
  const { user } = useUser();
  const supabase = createClientComponentClient();
  const [consultations, setConsultations] = useState<Consultation[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;

      const role = user.publicMetadata?.role;
      let query = supabase
        .from('consultations')
        .select('id, title, description, status, created_at')
        .order('created_at', { ascending: false });

      if (role !== 'admin' && role !== 'doctor') {
        query = query.eq('patient_id', user.id);
      } else if (role === 'doctor') {
        query = query.eq('doctor_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching consultations:', error);
      } else {
        setConsultations(data);
      }

      setLoading(false);
    };

    fetchConsultations();
  }, [user, supabase]);

  return (
    <div className="min-h-screen bg-[#f5efe6] py-6">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-semibold text-[#265c8f]">Your Consultations</h1>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {!loading && consultations?.length === 0 && (
          <Card className="bg-[#e8dfca] border border-[#d4cbb6] shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-[#265c8f] text-lg font-medium">No consultations yet.</p>
              <Link href="/consultations/new">
                <Button className="mt-4 bg-[#265c8f] text-white hover:bg-[#1e4b75]">
                  Start a Consultation
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!loading && consultations?.map((c) => (
          <Card key={c.id} className="bg-white border border-[#e8dfca] shadow-sm hover:shadow-md transition rounded-xl">
            <CardContent className="p-6 space-y-3">
              <div className="text-sm text-[#aebdca]">
                {new Date(c.created_at).toLocaleString()}
              </div>
              <h2 className="text-xl font-semibold text-[#265c8f]">{c.title}</h2>
              <p className="text-sm text-[#444]">{c.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    c.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : c.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {c.status}
                </span>
                <Link
                  href={`/consultations/${c.id}`}
                  className="text-sm text-[#7895b2] hover:underline font-medium"
                >
                  View consultation →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
