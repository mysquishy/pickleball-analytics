import type { Metadata } from 'next';
import { Syne } from 'next/font/google';
import React from 'react';
import './globals.css';
import { AssistantChatProvider } from '@/components/assistant-chat-provider';
import { AnalyticsProvider } from '@/components/analytics-provider';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: 'My SaaS App',
  description: 'Your SaaS description here',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={syne.className}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
        <AssistantChatProvider />
      </body>
    </html>
  );
}
