import { Resend } from 'resend';
import React from 'react';

export const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    to,
    subject,
    react,
  });
}
