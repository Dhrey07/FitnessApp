import React from 'react';
import Link from 'next/link';
import { ArrowRight, Camera, MessageSquare, CheckCircle2 } from 'lucide-react';

const SAMPLE_DAY = [
  { meal: 'Meal 1', food: 'Oats 60 g, 2 whole eggs, 1 banana', kcal: 520 },
  { meal: 'Snack', food: 'Greek yoghurt 170 g, groundnuts 20 g', kcal: 260 },
  { meal: 'Meal 2', food: 'Jollof rice 180 g cooked, grilled chicken 150 g, salad', kcal: 640 },
  { meal: 'Meal 3', food: 'Boiled yam 200 g, efo riro 1 bowl, fish 120 g', kcal: 600 },
];

export function NutritionSection() {
  const total = SAMPLE_DAY.reduce((s, m) => s + m.kcal, 0);
  return (
    <section id="nutrition" className="py-20 sm:py-24 bg-surface border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="label-xs text-brand">Nutrition</p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
            Nutrition that fits familiar foods.
          </h2>
          <p className="text-ink-secondary leading-relaxed">
            Jollof, yam, plantain, beans, eba and egusi can all sit inside a fat-loss plan when quantities are clear. Your meal plan gives exact weights, daily calorie and protein targets, and sensible swaps for eating out, travel and social events.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              'Day-by-day meal plan with exact food quantities',
              'Daily calorie, protein, carbohydrate and fat targets',
              'Guidelines on raw vs cooked weights, oils, sauces, drinks and missed meals',
              'A free nutrition log: describe or photograph a meal and get an estimate your coach checks',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <CheckCircle2 size={18} className="text-brand shrink-0 mt-0.5" />
                <span className="text-ink-secondary">{t}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/onboarding" className="btn-brand text-sm">
              Start your assessment <ArrowRight size={14} />
            </Link>
            <div className="flex items-center gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5"><Camera size={14} /> Photo</span>
              <span className="flex items-center gap-1.5"><MessageSquare size={14} /> Plain description</span>
            </div>
          </div>
        </div>

        <div className="surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold text-ink">Day 3 of 7</p>
            <span className="label-xs text-ink-muted">Example meal plan</span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {SAMPLE_DAY.map((m) => (
                <tr key={m.meal} className="border-t border-line">
                  <td className="py-3 pr-3 label-xs text-ink-muted whitespace-nowrap align-top">{m.meal}</td>
                  <td className="py-3 text-ink-secondary">{m.food}</td>
                  <td className="py-3 pl-3 text-right font-semibold text-ink whitespace-nowrap">{m.kcal} kcal</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[var(--accent)]">
                <td colSpan={2} className="pt-3 font-semibold text-ink">Daily total</td>
                <td className="pt-3 text-right font-display font-bold text-ink">{total.toLocaleString()} kcal</td>
              </tr>
            </tfoot>
          </table>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[['Protein', '165 g'], ['Carbs', '210 g'], ['Fat', '62 g']].map(([k, v]) => (
              <div key={k} className="p-2.5 rounded-lg bg-paper border border-line">
                <p className="text-ink-muted">{k}</p>
                <p className="font-semibold text-ink">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
