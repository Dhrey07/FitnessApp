'use client';

import React, { useState, useEffect } from 'react';
import { AdminAppShell } from '@/components/admin/AdminAppShell';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('31');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [goalAchieved, setGoalAchieved] = useState('Lost 11kg & Restored Daily Stamina');
  const [startingWeightKg, setStartingWeightKg] = useState('89.0');
  const [endingWeightKg, setEndingWeightKg] = useState('78.0');
  const [durationWeeks, setDurationWeeks] = useState('12');
  const [quote, setQuote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote) return;

    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          age,
          location,
          goalAchieved,
          startingWeightKg,
          endingWeightKg,
          durationWeeks,
          quote,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Transformation story published live to the public website!');
        setName('');
        setQuote('');
        fetchTestimonials();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAppShell
      title="Member Social Proof & Testimonials Manager"
      subtitle="Publish verified client results and testimonials to the public website."
    >
      {successMsg && (
        <div className="p-4 rounded-xl bg-status-approved/15 border border-status-approved/40 text-status-approved text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Add Story Form */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleAddTestimonial} className="surface p-6 sm:p-7 space-y-5 border border-[var(--border-subtle)]">
            <div>
              <span className="label-xs text-brand">Transformation Publishing</span>
              <h3 className="section-title text-base mt-0.5">Add Verified Client Story</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="field-label">Client Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Babatunde Fashola"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lagos, Nigeria"
                  className="field-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div>
                <label className="field-label">Start Wt (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={startingWeightKg}
                  onChange={(e) => setStartingWeightKg(e.target.value)}
                  className="field-input text-center"
                />
              </div>
              <div>
                <label className="field-label">End Wt (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={endingWeightKg}
                  onChange={(e) => setEndingWeightKg(e.target.value)}
                  className="field-input text-center text-brand font-bold"
                />
              </div>
              <div>
                <label className="field-label">Duration (Wks)</label>
                <input
                  type="number"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  className="field-input text-center"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Goal Achieved Summary</label>
              <input
                type="text"
                required
                value={goalAchieved}
                onChange={(e) => setGoalAchieved(e.target.value)}
                placeholder="e.g. Lost 11kg & Dropped 3 Pant Sizes"
                className="field-input"
              />
            </div>

            <div>
              <label className="field-label">Client Written Testimonial Quote</label>
              <textarea
                rows={4}
                required
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Describe their experience with the coaching, the accountability and the results..."
                className="field-input resize-none text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-md"
            >
              {submitting ? 'Publishing Story...' : 'Publish Transformation Story'} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Right Column: Published Stories List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title text-sm">Published Member Stories ({testimonials.length})</h3>
            <span className="text-xs text-[var(--text-muted)]">Live on Website</span>
          </div>

          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.id} className="surface p-5 space-y-3 border border-[var(--border-subtle)] text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--text-heading)] text-sm">{t.name}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{t.location} • {t.durationWeeks} Weeks</p>
                  </div>
                  <span className="badge badge-approved text-xs">
                    <ShieldCheck size={11} /> Verified
                  </span>
                </div>

                <div className="p-2.5 bg-paper rounded-lg flex items-center justify-between font-semibold">
                  <span className="text-[var(--text-secondary)]">{t.goalAchieved}</span>
                  <span className="text-brand">{t.startingWeightKg}kg → {t.endingWeightKg}kg</span>
                </div>

                <p className="text-[var(--text-secondary)] italic leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminAppShell>
  );
}
