import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const fcSound = localFont({
  src: './fonts/FCSound.ttf',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'My Chat App',
  description: 'A simple chat application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fcSound.className}>{children}</body>
    </html>
  );
}