'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// Define a type for Consultation
interface Consultation {
  id: string;
  created_at: string;
  symptom: string;
  details: string;
  status: 'pending' | 'completed' | 'closed' | string;
  doctor_response?: string;
}

export default function ConsultationDetailPage() {
  const supabase = createClientComponentClient();
  const { id } = useParams();
  const { user } = useUser();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchConsultation = async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) {
      setConsultation(data);
    } else {
      console.error('Error fetching consultation:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConsultation();
    // Only run on id change
  }, [id]);

  const handleClose = async () => {
    if (!consultation || updating) return;
    const confirmClose = window.confirm('Are you sure you want to close this consultation?');
    if (!confirmClose) return;

    setUpdating(true);
    const { error } = await supabase
      .from('consultations')
      .update({ status: 'closed' })
      .eq('id', consultation.id);

    if (!error) {
      fetchConsultation();
    } else {
      console.error('Error updating status:', error);
    }
    setUpdating(false);
  };

  const isDoctor = user?.publicMetadata?.role === 'doctor';

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!consultation) {
    return <p className="text-center mt-10 text-muted-foreground">Consultation not found.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            {new Date(consultation.created_at).toLocaleString()}
          </div>
          <h1 className="text-xl font-semibold">{consultation.symptom}</h1>
          <p className="text-gray-800 whitespace-pre-line">{consultation.details}</p>

          <div className="text-sm">
            <span
              className={`inline-block px-2 py-1 rounded text-xs mt-2
                ${consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                consultation.status === 'completed' ? 'bg-green-100 text-green-700' :
                consultation.status === 'closed' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-600'}`}
            >
              {consultation.status}
            </span>
          </div>

          {consultation.status !== 'closed' && isDoctor && (
            <Button
              variant="destructive"
              className="mt-4"
              onClick={handleClose}
              disabled={updating}
            >
              {updating ? 'Closing...' : 'Close Question'}
            </Button>
          )}

          {consultation.doctor_response && (
            <div className="mt-6">
              <h2 className="text-md font-semibold">Doctor&apos;s Response</h2>
              <p className="mt-2 text-gray-900 whitespace-pre-line">
                {consultation.doctor_response}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
