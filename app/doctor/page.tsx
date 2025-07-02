'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DoctorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <section className="text-center">
        <Image
          src="/dr-madhumita-mazumdar.jpeg"
          alt="Dr. Madhumita Mazumdar"
          width={160}
          height={160}
          className="rounded-full mx-auto mb-4 border"
        />
        <h1 className="text-3xl font-bold text-indigo-700">Dr. Madhumita Mazumdar</h1>
        <p className="text-gray-600 text-sm mt-1">MD (O&G) – Senior Consultant Gynecologist</p>
      </section>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Experience & Background</h2>
          <p className="text-muted-foreground">
            Dr. Madhumita Mazumdar brings over 30 years of experience in Obstetrics and Gynecology. She has served as Senior Consultant at Marwari Maternity Hospital for 12+ years and now practices at Aries OB-GYN Clinic in Guwahati.
          </p>
          <p className="text-muted-foreground">
            Her expertise includes managing PCOS, infertility, pregnancy care, menopause, menstrual problems, preventive screening, and adolescent health.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Why Consult Her Online?</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>Trusted care for sensitive issues from your home</li>
            <li>Fast, text-based consultations via secure platform</li>
            <li>Follow-up responses included for free</li>
            <li>Private, judgment-free, and experience-backed answers</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Booking & Availability</h2>
          <p className="text-muted-foreground">Dr. Mazumdar is available for online consultations Monday to Friday, 9:00 AM – 5:00 PM IST.</p>
          <Link href="/consult">
            <Button className="mt-2">Start a Consultation</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Patient Testimonials</h2>
          <p className="text-muted-foreground italic">“Dr. Mazumdar helped me navigate my PCOS symptoms with kindness and clarity. Highly recommend!” – R.P.</p>
          <p className="text-muted-foreground italic">“Very responsive and empathetic. I got the answers I needed quickly.” – S.D.</p>
          <Link href="/testimonials">
            <Button variant="outline" className="mt-2">Read More Testimonials</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Credentials</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>MD – Obstetrics & Gynecology, Gauhati Medical College</li>
            <li>Senior Consultant – Marwari Maternity Hospital (12+ years)</li>
            <li>Founder – Aries OB-GYN Clinic, Guwahati</li>
            <li>Member – Federation of Obstetric and Gynaecological Societies of India (FOGSI)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}