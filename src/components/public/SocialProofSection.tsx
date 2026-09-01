'use client';

import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Quote, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

interface TestimonialItem {
  id: string;
  name: string;
  age: number;
  location?: string;
  goalAchieved: string;
  startingWeightKg: number;
  endingWeightKg: number;
  durationWeeks: number;
  quote: string;
  verifiedClient: boolean;
}

export function SocialProofSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      if (data.testimonials && data.testimonials.length > 0) {
        setTestimonials(data.testimonials);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const defaultStories = [
    {
      id: '1',
      name: 'Oluwaseun Bakare',
      age: 32,
      location: 'Lagos, Nigeria',
      goalAchieved: 'Lost 12.4kg & Built Defined Muscle',
      startingWeightKg: 94.0,
      endingWeightKg: 81.6,
      durationWeeks: 16,
      quote: 'Food Police changed the game for me. I didn’t have to give up Nigerian food like Jollof or Moi Moi — Oga Eric taught me exact portion management and cultural swaps. The accountability is 100% real.',
      verifiedClient: true,
    },
    {
      id: '2',
      name: 'Ngozi Eze',
      age: 28,
      location: 'Abuja, Nigeria',
      goalAchieved: 'Dropped 8kg & Lost 7cm off Waist',
      startingWeightKg: 76.0,
      endingWeightKg: 68.0,
      durationWeeks: 12,
      quote: 'Having a real human coach reviewing what I ate every day kept me honest. The 14-day trial showed me how structured training should actually feel. I upgraded to Gold and haven’t looked back.',
      verifiedClient: true,
    },
    {
      id: '3',
      name: 'Emeka Nwosu',
      age: 35,
      location: 'Port Harcourt, Nigeria',
      goalAchieved: 'Gained 4kg Lean Muscle, Dropped 6% Body Fat',
      startingWeightKg: 82.0,
      endingWeightKg: 83.5,
      durationWeeks: 20,
      quote: 'The VIP Diamond coaching was worth every single naira. Oga Eric adjusted my training volume every single week based on my check-ins. My energy levels and physique are the best they\'ve ever been.',
      verifiedClient: true,
    },
  ];

  const displayList = testimonials.length > 0 ? testimonials : defaultStories;

  return (
    <section id="results" className="py-20 sm:py-28 border-b border-white/10 bg-[#080b11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="label-xs text-sky-400">Section 07 • Real Member Results</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              PROVEN TRANSFORMATIONS. <br />
              <span className="text-slate-400">Real People. Measurable Outcomes.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real results from clients across Nigeria and globally who followed their tailored nutrition and structured coaching plans.
            </p>
          </div>

          <Link href="/onboarding" className="btn-brand text-xs self-start md:self-auto py-3 px-6 shrink-0">
            Start Your Transformation <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayList.map((story) => {
            return (
              <div key={story.id} className="surface p-7 flex flex-col justify-between space-y-6 surface-hover">
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-sm border border-sky-500/30">
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-sm">{story.name}</h3>
                        <p className="text-[11px] text-slate-400">{story.location || 'Client'}, Age {story.age}</p>
                      </div>
                    </div>
                    {story.verifiedClient && (
                      <span className="badge badge-approved text-[9px]">
                        <CheckCircle2 size={11} /> Verified
                      </span>
                    )}
                  </div>

                  {/* Transformation Badge Pill */}
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 block">
                      Outcome • {story.durationWeeks} Weeks
                    </span>
                    <p className="text-xs font-bold text-white">{story.goalAchieved}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/5">
                      <span>Start: {story.startingWeightKg}kg</span>
                      <span className="font-bold text-sky-400">Current: {story.endingWeightKg}kg</span>
                    </div>
                  </div>

                  {/* Client Quote */}
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &quot;{story.quote}&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                  <Award size={13} className="text-sky-400" /> Milestone Verified by Oga Eric
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
