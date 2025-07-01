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
  symptom: string;
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
        .select('id, symptom, status, created_at')
        .order('created_at', { ascending: false });

      if (role !== 'admin') {
        query = query.eq('patient_id', user.id);
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
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">My Consultations</h1>

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!loading && consultations?.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 space-y-4 text-center">
            <p className="text-gray-700 text-lg">No consultations found.</p>
            <Link href="/consultations/new">
              <Button variant="default" className="mt-2">Start a Consultation</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {!loading &&
        consultations?.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition">
            <CardContent className="p-4 space-y-2">
              <div className="text-sm text-muted-foreground">
                {new Date(c.created_at).toLocaleString()}
              </div>
              <h2 className="text-lg font-medium">{c.symptom}</h2>
              <div className="text-sm">
                <span
                  className={`px-2 py-1 rounded ${
                    c.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : c.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <Link
                href={`/consultations/${c.id}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View consultation →
              </Link>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
