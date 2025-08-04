import type { Metadata } from 'next';
import './globals.css';
import Head from 'next/head'; // ✅ import this

export const metadata: Metadata = {
  title: 'WordWiser | AI Dictionary',
  description: 'Word Wiser | AI Dictionary',
  generator: 'v0.dev',
  icons: {
    icon: '/wisewords.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <body>{children}</body>
    </html>
  );
}
