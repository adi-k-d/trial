'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DoctorPage() {
  return (
    <div className="max-w-screen-md mx-auto px-4 md:px-6 py-10 space-y-10">
      {/* Profile Section */}
      <section className="text-center">
        <Image
          src="/dr-madhumita-mazumdar.jpeg"
          alt="Dr. Madhumita Mazumdar"
          width={160}
          height={160}
          className="rounded-full mx-auto mb-4 border shadow-sm"
        />
        <h1 className="text-3xl font-bold text-primary">Dr. Madhumita Mazumdar</h1>
        <p className="text-muted-foreground text-sm mt-1">
          MD (O&G) – Senior Consultant Gynecologist
        </p>
      </section>

      {/* Experience Section */}
      <Card className="shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Experience & Background</h2>
          <p className="text-muted-foreground">
            Dr. Madhumita Mazumdar brings over 30 years of experience in Obstetrics and Gynecology.
            She has served as Senior Consultant at Marwari Maternity Hospital for 12+ years and now
            practices at Aries OB-GYN Clinic in Guwahati.
          </p>
          <p className="text-muted-foreground">
            Her expertise includes managing PCOS, infertility, pregnancy care, menopause, menstrual
            problems, preventive screening, and adolescent health.
          </p>
        </CardContent>
      </Card>

      {/* Why Online Section */}
      <Card className="shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Why Consult Her Online?</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>Trusted care for sensitive issues from your home</li>
            <li>Fast, text-based consultations via secure platform</li>
            <li>Follow-up responses included for free</li>
            <li>Private, judgment-free, and experience-backed answers</li>
          </ul>
        </CardContent>
      </Card>

      {/* Booking Section */}
      <Card className="shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Booking & Availability</h2>
          <p className="text-muted-foreground">
            Dr. Mazumdar is available for online consultations Monday to Friday, 9:00 AM – 5:00 PM IST.
          </p>
          <Link href="/consult">
            <Button className="mt-2 w-full sm:w-auto">Start a Consultation</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Testimonials Section */}
      <Card className="shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Patient Testimonials</h2>
          <p className="text-muted-foreground italic">
            “Dr. Mazumdar helped me navigate my PCOS symptoms with kindness and clarity. Highly recommend!” – R.P.
          </p>
          <p className="text-muted-foreground italic">
            “Very responsive and empathetic. I got the answers I needed quickly.” – S.D.
          </p>
          <Link href="/testimonials">
            <Button variant="outline" className="mt-2 w-full sm:w-auto">
              Read More Testimonials
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Credentials Section */}
      <Card className="shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Credentials</h2>
          <ul className="list-disc ml-5 text-muted-foreground space-y-1">
            <li>MD – Obstetrics & Gynecology, Gauhati Medical College</li>
            <li>Senior Consultant – Marwari Maternity Hospital (12+ years)</li>
            <li>Founder – Aries OB-GYN Clinic, Guwahati</li>
            <li>
              Member – Federation of Obstetric and Gynaecological Societies of India (FOGSI)
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
