import React from 'react';
import { Button } from '@/components/ui/Button';
import { Document, DocumentRow } from '@/components/ui/Document';
import { Photo } from '@/components/ui/Photo';
import { resolvePhoto } from '@/lib/photos';

const SAMPLE_DAY = [
  { meal: 'Meal 1', food: 'Oats 60 g, 2 whole eggs, 1 banana', kcal: 520 },
  { meal: 'Snack', food: 'Greek yoghurt 170 g, groundnuts 20 g', kcal: 260 },
  { meal: 'Meal 2', food: 'Jollof rice 180 g cooked, grilled chicken 150 g, salad', kcal: 640 },
  { meal: 'Meal 3', food: 'Boiled yam 200 g, efo riro 1 bowl, fish 120 g', kcal: 600 },
];

/** Plate photograph left, a meal-plan day as a Document right. */
export function NutritionSection() {
  const plate = resolvePhoto('plate');
  const total = SAMPLE_DAY.reduce((s, m) => s + m.kcal, 0);

  return (
    <section id="nutrition" className="pub-section bg-surface">
      <div className="pub-container space-y-12 md:space-y-16">
        <div className="pub-reading">
          <p className="t-overline">Nutrition</p>
          <h2 className="t-display mt-3">Nutrition that fits the food you already eat.</h2>
          <p className="t-body text-ink-secondary mt-5">
            Jollof, yam, plantain, beans and eba all sit inside a fat-loss plan when the quantities are clear. Your plan gives exact weights, a daily calorie and protein target, and sensible swaps for eating out and travel. A free nutrition log lets you describe or photograph a meal and get an estimate your coach checks.
          </p>
          <div className="mt-8">
            <Button href="/onboarding">Start your assessment</Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          <Photo photo={plate} alt="Jollof rice, grilled chicken and salad, weighed portions" ratio="1/1" sizes="(min-width: 768px) 50vw, 100vw" />
          <Document title="Day 3 of 7" subtitle="Fat loss · moderate deficit" meta={<>Example plan<br />2,020 kcal · 165 g protein</>} footer={<span>Protein 165 g · Carbs 210 g · Fat 62 g</span>}>
            {SAMPLE_DAY.map((m) => (
              <DocumentRow key={m.meal} label={m.meal} value={`${m.kcal} kcal`}>
                {m.food}
              </DocumentRow>
            ))}
            <DocumentRow value={`${total.toLocaleString()} kcal`}>
              <span className="font-semibold">Daily total</span>
            </DocumentRow>
          </Document>
        </div>
      </div>
    </section>
  );
}
