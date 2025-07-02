'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FaWhatsapp } from 'react-icons/fa';

interface Consultation {
  id: string;
  created_at: string;
  title: string;
  description: string;
  doctor_id: string;
  status: 'pending' | 'completed' | 'closed' | string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  consultation_id: string;
  user_name: string;
  user_image: string;
  role: string;
}

interface Doctor {
  id: string;
  name: string;
  profile_picture_url: string | null;
  specialization: string;
  experience_years?: number;
  qualifications?: string;
  languages?: string[];
  whatsapp_number?: string;
}

export default function ConsultationDetailPage() {
  const supabase = createClientComponentClient();
  const { id } = useParams();
  const { user } = useUser();

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const isDoctor = user?.publicMetadata?.role === 'doctor';

  useEffect(() => {
    fetchConsultation();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (consultation?.doctor_id) {
      fetchDoctorDetails(consultation.doctor_id);
    }
  }, [consultation]);

  const fetchConsultation = async () => {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) setConsultation(data);
    else console.error('Error fetching consultation:', error);
    setLoading(false);
  };

  const fetchDoctorDetails = async (doctorId: string) => {
    const { data, error } = await supabase
      .from('doctors')
      .select(
        'id, name, profile_picture_url, specialization, experience_years, qualifications, languages, whatsapp_number'
      )
      .eq('id', doctorId)
      .single();

    if (!error) setDoctor(data);
    else console.error('Error fetching doctor:', error);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('consultation_messages')
      .select('*, user:profiles(name, avatar_url, role)')
      .eq('consultation_id', id)
      .order('created_at', { ascending: true });

    if (!error) {
      const formatted = data.map((comment: any) => ({
        ...comment,
        user_name: comment.user?.name || 'User',
        user_image: comment.user?.avatar_url || '',
        role: comment.user?.role || 'user',
      }));
      setComments(formatted);
    } else {
      console.error('Error loading messages:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setCommentSubmitting(true);
    const { error } = await supabase.from('consultation_messages').insert([
      {
        consultation_id: id,
        content: newComment.trim(),
        user_id: user?.id,
      },
    ]);

    if (!error) {
      setNewComment('');
      fetchComments();
    } else {
      console.error('Error submitting message:', error);
    }
    setCommentSubmitting(false);
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
    return <p className="text-center mt-10 text-muted-foreground">Consultation not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Consultation Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            Asked on {new Date(consultation.created_at).toLocaleString()}
          </div>

          <h1 className="text-xl font-semibold text-[#265c8f]">{consultation.title}</h1>
          <p className="text-gray-800 whitespace-pre-line">{consultation.description}</p>

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

              <p className="text-sm text-muted-foreground mt-2">
                You can also continue chatting below.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <div className="bg-muted rounded-md border p-4 max-h-[500px] overflow-y-auto space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          comments.map((msg) => {
            const isFromDoctor = msg.role === 'doctor';
            return (
              <div
                key={msg.id}
                className={`flex ${isFromDoctor ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[75%] ${
                    isFromDoctor ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.user_image} />
                    <AvatarFallback>{msg.user_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 text-sm ${
                      isFromDoctor
                        ? 'bg-[#265c8f] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="font-medium">{msg.user_name}</p>
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Field */}
      {consultation.status !== 'closed' && (
        <div className="sticky bottom-4 bg-background border rounded-md p-4 space-y-2">
          <Textarea
            placeholder="Type your message..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
          />
          <Button onClick={handleAddComment} disabled={commentSubmitting} className="w-full">
            {commentSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </div>
      )}
    </div>
  );
}
