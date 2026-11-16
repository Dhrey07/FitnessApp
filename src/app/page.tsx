import React from 'react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { HeroSection } from '@/components/public/HeroSection';
import { ResultsSection } from '@/components/public/ResultsSection';
import { HowItWorksSection } from '@/components/public/HowItWorksSection';
import { NutritionSection } from '@/components/public/NutritionSection';
import { TrainingSection } from '@/components/public/TrainingSection';
import { CoachSection } from '@/components/public/CoachSection';
import { PricingSection } from '@/components/public/PricingSection';
import { FaqSection } from '@/components/public/FaqSection';
import { FinalCtaSection } from '@/components/public/FinalCtaSection';
import { PublicFooter } from '@/components/public/PublicFooter';

// Client results are read from the database on each request.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <HeroSection />
        <ResultsSection />
        <HowItWorksSection />
        <NutritionSection />
        <TrainingSection />
        <CoachSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <PublicFooter />
    </div>
  );
}
