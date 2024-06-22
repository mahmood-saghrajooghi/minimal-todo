import type { Metadata } from "next";
import clsx from 'clsx';
import { GeistSans } from 'geist/font/sans';

import "./globals.css";

export const metadata: Metadata = {
  title: "Flow todos",
  description: "A minimal todo app to stay in flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(GeistSans.className, 'dark')}>{children}</body>
    </html>
  );
}
