import React from 'react';
import { PublicHeader } from '@/components/public/PublicHeader';
import { HeroSection } from '@/components/public/HeroSection';
import { TransformationSection } from '@/components/public/TransformationSection';
import { FitnessSection } from '@/components/public/FitnessSection';
import { NutritionSection } from '@/components/public/NutritionSection';
import { PersonalisationSection } from '@/components/public/PersonalisationSection';
import { TrackingSection } from '@/components/public/TrackingSection';
import { CoachingSection } from '@/components/public/CoachingSection';
import { SocialProofSection } from '@/components/public/SocialProofSection';
import { PricingSection } from '@/components/public/PricingSection';
import { FinalCtaSection } from '@/components/public/FinalCtaSection';
import { PublicFooter } from '@/components/public/PublicFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-sky-400 selection:text-slate-950 transition-colors duration-200">
      {/* Editorial Navigation Header */}
      <PublicHeader />

      <main className="flex-1 space-y-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Section 1: Transformation */}
        <TransformationSection />

        {/* Section 2: Fitness (Fitness Police) */}
        <FitnessSection />

        {/* Section 3: Nutrition (Food Police - Free) */}
        <NutritionSection />

        {/* Section 4: Personalisation */}
        <PersonalisationSection />

        {/* Section 5: Tracking */}
        <TrackingSection />

        {/* Section 6: Coaching */}
        <CoachingSection />

        {/* Section 7: Social Proof & Transformations */}
        <SocialProofSection />

        {/* Membership Tiers */}
        <PricingSection />

        {/* Section 8: Final Conversion CTA */}
        <FinalCtaSection />
      </main>

      {/* Editorial Footer */}
      <PublicFooter />
    </div>
  );
}
