import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CULTBRAND CRM',
  description: 'CRM para gestión de prospectos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang=\"es\">
      <body className={inter.className}>
        <div className=\"flex\">
          <Sidebar />
          <main className=\"flex-1 ml-64 p-8 bg-gray-50 min-h-screen\">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
