'use client';

import { Header } from '@/components/layout/header';
import { ThemeDetails } from '@/components/themes/theme-details';

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="py-8">
          <ThemeDetails />
        </main>
      </div>
    </div>
  );
}
