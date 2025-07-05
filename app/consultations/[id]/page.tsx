'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaWhatsapp } from 'react-icons/fa';

interface ChatMessage {
  timestamp: string;
  message: string;
  name: string;
  role: string;
  avatar_url: string;
}

interface Consultation {
  id: string;
  created_at: string;
  title: string;
  description: string;
  doctor_id: string;
  status: string;
  content: ChatMessage[];
}

interface Doctor {
  id: string;
  name: string;
  profile_picture_url: string | null;
  specialization: string;
  experience_years?: number;
  qualifications?: string;
  whatsapp_number?: string;
}

export default function ConsultationDetailPage() {
  const supabase = createClientComponentClient();
  const { id } = useParams(); // consultation id
  const { user } = useUser(); // current logged-in user

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchConsultation = useCallback(async () => {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching consultation:', error);
      setLoading(false);
      return;
    }

    const msgs: ChatMessage[] =
      (data.content as ChatMessage[])?.length
        ? (data.content as ChatMessage[])
        : [
            {
              timestamp: data.created_at,
              message: data.description,
              name: 'Patient',
              role: 'patient',
              avatar_url: '',
            },
          ];

    setConsultation(data as Consultation);
    setMessages(msgs);
    setLoading(false);
  }, [id, supabase]);

  const fetchDoctor = useCallback(
    async (doctorId: string) => {
      const { data, error } = await supabase
        .from('doctors')
        .select(
          'id, name, profile_picture_url, specialization, experience_years, qualifications, whatsapp_number'
        )
        .eq('id', doctorId)
        .single();
      if (!error) setDoctor(data as Doctor);
      else console.error('Error fetching doctor:', error);
    },
    [supabase]
  );

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  useEffect(() => {
    if (consultation?.doctor_id) fetchDoctor(consultation.doctor_id);
  }, [consultation, fetchDoctor]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    setSending(true);

    const freshMsg: ChatMessage = {
      timestamp: new Date().toISOString(),
      message: newMsg.trim(),
      name: user?.fullName || 'Anonymous',
      role: user?.publicMetadata?.role === 'doctor' ? 'doctor' : 'patient',
      avatar_url: user?.imageUrl || '',
    };

    const updated = [...messages, freshMsg];

    const { error } = await supabase
      .from('consultations')
      .update({ content: updated })
      .eq('id', id);

    if (!error) {
      setMessages(updated);
      setNewMsg('');
    } else {
      console.error('Failed to update messages:', error);
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Consultation not found.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Header / Issue Summary */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            Asked on {new Date(consultation.created_at).toLocaleString()}
          </div>

          {doctor && (
            <div className="mt-6">
              <p className="text-sm font-medium text-[#265c8f] mb-2">Assigned Doctor</p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#dcd2b4] bg-[#fdfaf3] rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.profile_picture_url || ''} />
                    <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#265c8f]">{doctor.name}</p>
                    <p className="text-sm text-gray-700">
                      {doctor.specialization} · {doctor.experience_years ?? 0}+ yrs
                    </p>
                    {doctor.qualifications && (
                      <p className="text-xs text-gray-500">{doctor.qualifications}</p>
                    )}
                  </div>
                </div>

                {doctor.whatsapp_number && (
                  <div className="w-full sm:max-w-[220px]">
                    <a
                      href={`https://wa.me/${doctor.whatsapp_number}?text=${encodeURIComponent(
                        `Hi Dr. ${doctor.name}, I’m reaching out regarding my consultation titled "${consultation.title}".`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 text-green-600 border-green-500 hover:bg-green-50 text-sm font-medium"
                      >
                        <FaWhatsapp className="text-lg" />
                        Message on WhatsApp
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <h1 className="text-xl font-semibold text-[#265c8f]">{consultation.title}</h1>
        </CardContent>
      </Card>

      {/* Chat Thread */}
      <div className="bg-muted rounded-md border p-4 max-h-[500px] overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((msg, idx) => {
            const isCurrentUser = msg.name === (user?.fullName || 'Anonymous');
            const isDoctor = msg.role === 'doctor';

            return (
              <div
                key={idx}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${
                    isCurrentUser ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar_url} />
                    <AvatarFallback>{msg.name[0]}</AvatarFallback>
                  </Avatar>

                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm whitespace-pre-line ${
                      isCurrentUser
                        ? 'bg-[#d1f3d1] text-gray-900'
                        : 'bg-white border text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{msg.name}</p>
                      <span className="text-xs text-muted-foreground font-medium">
                        ({isDoctor ? 'Doctor' : 'Patient'})
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed">{msg.message}</p>

                    <p className="text-[11px] text-muted-foreground mt-2 text-right">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Box */}
      {consultation.status !== 'closed' && (
        <div className="sticky bottom-4 bg-background border rounded-md p-4 space-y-2">
          <Textarea
            placeholder="Type your message…"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="resize-none"
          />
          <Button onClick={handleSend} disabled={sending} className="w-full">
            {sending ? 'Sending…' : 'Send'}
          </Button>
        </div>
      )}
    </div>
  );
}
