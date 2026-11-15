'use client';

import React, { useState, useEffect } from 'react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import {
  Utensils,
  Camera,
  MessageSquare,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Info,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { PhotoPlaceholder } from '@/components/brand/PhotoPlaceholder';
import { MealPlanView } from '@/components/nutrition/MealPlanView';
import { BRAND } from '@/lib/brand';

export default function NutritionClientPage() {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<'NATURAL_LANGUAGE' | 'PHOTO' | 'SEARCH'>('NATURAL_LANGUAGE');
  const [view, setView] = useState<'LOG' | 'PLAN'>('LOG');
  const [rawInput, setRawInput] = useState('');
  const [mealType, setMealType] = useState('LUNCH');
  const [photoUrl, setPhotoUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  // Built-in African & global food library for fast searching
  const quickFoods = [
    { name: 'Jollof Rice (1 cup)', calories: 320, protein: 6, carbs: 58, fat: 8, category: 'LUNCH' },
    { name: 'Grilled Chicken Breast (150g)', calories: 220, protein: 32, carbs: 0, fat: 9, category: 'LUNCH' },
    { name: 'Fried Plantain / Dodo (5 slices)', calories: 180, protein: 1, carbs: 32, fat: 7, category: 'SNACK' },
    { name: 'Pounded Yam (1 wrap)', calories: 360, protein: 3, carbs: 82, fat: 1, category: 'DINNER' },
    { name: 'Egusi Soup with Meat (1 bowl)', calories: 380, protein: 22, carbs: 8, fat: 28, category: 'DINNER' },
    { name: 'Efo Riro / Spinach Stew (1 bowl)', calories: 240, protein: 18, carbs: 6, fat: 16, category: 'LUNCH' },
    { name: 'Moi Moi (1 wrap)', calories: 160, protein: 9, carbs: 20, fat: 5, category: 'BREAKFAST' },
    { name: 'Grilled Tilapia (1 fish)', calories: 190, protein: 28, carbs: 0, fat: 8, category: 'DINNER' },
    { name: 'Boiled Eggs (2 large)', calories: 140, protein: 12, carbs: 1, fat: 10, category: 'BREAKFAST' },
    { name: 'Oatmeal (1 cup cooked)', calories: 200, protein: 7, carbs: 34, fat: 4, category: 'BREAKFAST' },
  ];

  useEffect(() => {
    fetchFoodData();
  }, []);

  const fetchFoodData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      setUser(meData.user);

      const qRes = await fetch('/api/nutrition/queue');
      const qData = await qRes.json();
      setHistory(qData.queue || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!rawInput && tab !== 'PHOTO') {
      setErrorMsg('Please describe or select your meal.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const input = tab === 'PHOTO' ? rawInput || 'Meal photo submission' : rawInput;

      const res = await fetch('/api/nutrition/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          submissionType: tab === 'SEARCH' ? 'MANUAL' : tab,
          rawInput: input,
          imageUrl: tab === 'PHOTO' ? photoUrl : null,
          mealType,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit meal');

      setSuccessMsg('Meal logged! AI macronutrient breakdown generated and queued for coach verification.');
      setRawInput('');
      fetchFoodData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickAdd = (food: typeof quickFoods[0]) => {
    const text = `${food.name} - ~${food.calories} kcal (${food.protein}g protein, ${food.carbs}g carbs, ${food.fat}g fat)`;
    setRawInput(text);
  };

  const filteredFoods = quickFoods.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ClientAppShell
      title="Nutrition Log"
      subtitle="Log what you eat by photo or plain description. Nigerian and international foods are recognised, and your coach checks the estimate."
    >
      {/* 100% Free Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-brand-soft border border-line-active flex flex-wrap items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3">
          <span className="badge badge-approved text-xs">Free</span>
          <p className="text-xs text-[var(--text-secondary)]">
            The nutrition log is free for every registered client. Every estimate is checked by your coach.
          </p>
        </div>
        {/* The one playful sub-brand touchpoint in the product. Everything else uses ERICONET naming. */}
        <span className="badge badge-trial hidden sm:inline-flex normal-case tracking-normal" title="Our light-hearted name for coach-checked meals">
          {BRAND.subBrand.name}: every meal gets a verdict
        </span>
      </div>

      <div className="flex gap-1.5 w-full" role="tablist" aria-label="Nutrition views">
        {([['LOG', 'Log a meal'], ['PLAN', 'My meal plan']] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${view === k ? 'bg-brand-strong text-brand-on-strong border-transparent' : 'bg-surface text-ink-secondary border-line hover:border-line-active'}`}>
            {l}
          </button>
        ))}
      </div>

      {view === 'PLAN' && user?.id && <MealPlanView userId={user.id} />}

      {view === 'LOG' && successMsg && (
        <div className="p-4 rounded-xl bg-status-approved/15 border border-status-approved/40 text-status-approved text-xs flex items-center gap-2 animate-fade-in w-full">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-status-rejected/15 border border-status-rejected/40 text-status-rejected text-xs flex items-center gap-2 animate-fade-in w-full">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {view === 'LOG' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Left Column: Meal submission */}
        <div className="lg:col-span-7 space-y-6">
          <div className="surface p-6 sm:p-7 space-y-6 border border-[var(--border-subtle)]">
            
            {/* Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h3 className="section-title text-base">Log a Meal</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Select your preferred logging method.</p>
              </div>

              <div className="bg-paper p-1 rounded-xl border border-[var(--border-subtle)] flex items-center text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTab('NATURAL_LANGUAGE')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    tab === 'NATURAL_LANGUAGE'
                      ? 'bg-brand-strong text-brand-on-strong font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  <MessageSquare size={13} /> Text
                </button>
                <button
                  type="button"
                  onClick={() => setTab('PHOTO')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    tab === 'PHOTO'
                      ? 'bg-brand-strong text-brand-on-strong font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  <Camera size={13} /> Photo
                </button>
                <button
                  type="button"
                  onClick={() => setTab('SEARCH')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                    tab === 'SEARCH'
                      ? 'bg-brand-strong text-brand-on-strong font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  <Search size={13} /> Search Foods
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitMeal} className="space-y-4">
              {/* Meal Category Picker */}
              <div>
                <label className="field-label">Meal Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMealType(m)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        mealType === m
                          ? 'border-line-active bg-brand-soft text-brand'
                          : 'border-[var(--border-subtle)] surface text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Natural Language Tab */}
              {tab === 'NATURAL_LANGUAGE' && (
                <div>
                  <label className="field-label">Describe Your Meal</label>
                  <textarea
                    rows={3}
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="e.g. 2 cups of jollof rice, 1 grilled chicken breast, 4 slices of fried plantain"
                    className="field-input resize-none"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    African & global staples recognized: Jollof, Pounded Yam, Egusi, Efo Riro, Moi Moi, Suya, Dodo, Tilapia, Oatmeal, Eggs, etc.
                  </p>
                </div>
              )}

              {/* Photo Tab */}
              {tab === 'PHOTO' && (
                <div className="space-y-3">
                  <label className="field-label">Meal Photo Upload</label>
                  <div className="p-4 bg-paper rounded-xl border border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-center space-y-2">
                    {photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoUrl}
                        alt="Meal preview"
                        className="w-full h-40 object-cover rounded-lg border border-[var(--border-subtle)]"
                      />
                    ) : (
                      <PhotoPlaceholder aspect="h-40" label="No photo yet" className="rounded-lg" />
                    )}
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="Paste a photo link (optional)"
                      className="field-input text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Optional meal notes (e.g. Grilled tilapia with salad and roasted potatoes)"
                    className="field-input text-xs"
                  />
                </div>
              )}

              {/* Search Foods Tab */}
              {tab === 'SEARCH' && (
                <div className="space-y-3">
                  <label className="field-label">Search Built-in Food Library</label>
                  <div className="relative">
                    <Search size={14} className="text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type food name (e.g. Jollof, Chicken, Egusi, Yam)..."
                      className="field-input pl-9 text-xs"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {filteredFoods.map((food, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickAdd(food)}
                        className="w-full p-2.5 surface hover:border-[var(--border-active)] rounded-xl border border-[var(--border-subtle)] flex items-center justify-between text-left text-xs transition-colors"
                      >
                        <div>
                          <p className="font-bold text-[var(--text-heading)]">{food.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {food.protein}g Protein • {food.carbs}g Carbs • {food.fat}g Fat
                          </p>
                        </div>
                        <span className="text-brand font-bold text-xs">~{food.calories} kcal</span>
                      </button>
                    ))}
                  </div>

                  {rawInput && (
                    <div className="p-3 bg-paper rounded-xl border border-line-active text-xs">
                      <span className="text-xs text-[var(--text-muted)] uppercase font-bold block">Selected for Logging:</span>
                      <p className="font-bold text-[var(--text-heading)] mt-0.5">{rawInput}</p>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-brand text-xs w-full justify-center py-3 font-extrabold shadow-md"
              >
                {submitting ? 'Analyzing Macronutrients...' : 'Submit Meal for Analysis'}
              </button>
            </form>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-start gap-2 text-xs text-[var(--text-muted)]">
              <Info size={13} className="shrink-0 text-brand mt-0.5" />
              <span>
                Nutritional values are generated via nutrient estimation engines and verified by your human coach.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Nutrition Log Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title text-sm">Today&apos;s Meal Review Timeline</h3>
            <span className="text-xs text-[var(--text-muted)]">{history.length} Entries</span>
          </div>

          <div className="space-y-3">
            {history.map((sub) => {
              const ai = sub.foodAnalysis;
              const coach = sub.coachReview;
              const isApproved = sub.status === 'APPROVED';

              return (
                <div key={sub.id} className="surface p-5 space-y-3 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-paper text-ink-secondary border border-[var(--border-subtle)]">
                        {sub.mealType}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-heading)]">
                        ~{coach?.finalCalories || ai?.estimatedCalories || 500} kcal
                      </span>
                    </div>

                    <span className={`badge text-xs${
                      isApproved ? 'badge-approved' : 'badge-pending'
                    }`}>
                      {isApproved ? 'Coach Approved' : 'Awaiting Review'}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-primary)] font-medium italic">
                    &quot;{sub.rawInput}&quot;
                  </p>

                  {/* Macros breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-1.5 bg-paper rounded-lg border border-[var(--border-subtle)]">
                      <span className="text-brand font-bold block">{coach?.finalProtein || ai?.estimatedProtein || 30}g</span> Protein
                    </div>
                    <div className="p-1.5 bg-paper rounded-lg border border-[var(--border-subtle)]">
                      <span className="text-brand font-bold block">{coach?.finalCarbs || ai?.estimatedCarbs || 60}g</span> Carbs
                    </div>
                    <div className="p-1.5 bg-paper rounded-lg border border-[var(--border-subtle)]">
                      <span className="text-status-pending font-bold block">{coach?.finalFat || ai?.estimatedFat || 15}g</span> Fats
                    </div>
                  </div>

                  {/* Coach Feedback if exists */}
                  {coach && (
                    <div className="p-3 bg-paper rounded-xl border border-line-active text-xs space-y-1">
                      <p className="text-xs font-bold text-brand flex items-center gap-1">
                        <ShieldCheck size={12} /> Coach advice:
                      </p>
                      <p className="text-[var(--text-secondary)] text-xs leading-relaxed italic">
                        &quot;{coach.coachFeedback}&quot;
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
      )}
    </ClientAppShell>
  );
}
