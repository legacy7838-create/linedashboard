import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ExcelImportModal } from '@/components/ui/ExcelImportModal';
import { QualityDataProvider } from '@/context/QualityDataContext';
import { COMPANY_NAME, PORTAL_NAME } from '@/lib/constants/qualityConstants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${COMPANY_NAME} | ${PORTAL_NAME}`,
  description: 'Internal Manufacturing Quality Portal for Line Rejection, Line Rework, and FQC Fallout monitoring.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[#0C0C0C] text-[#FFFFFF] font-sans flex antialiased selection:bg-[#FF7900] selection:text-white">
        <QualityDataProvider>
          {/* Persistent Desktop Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#0C0C0C]">
            <Header />
            <main className="flex-1 p-6 md:p-8 max-w-[1920px] w-full mx-auto">
              {children}
            </main>
          </div>

          {/* Global Excel Import Modal Dialog */}
          <ExcelImportModal />
        </QualityDataProvider>
      </body>
    </html>
  );
}
