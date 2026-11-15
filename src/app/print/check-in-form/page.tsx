import React from 'react';
import { PrintSheet } from '@/components/print/PrintSheet';
import { PrintToolbar } from '@/components/print/PrintChrome';
import { BRAND } from '@/lib/brand';

export const metadata = { title: 'Weekly check-in form' };

const FIELDS: [string, string][] = [
  ['Current weight (kg)', 'Morning, after the bathroom, before eating. Average of the week if you weigh daily.'],
  ['Waist measurement (cm)', 'At the navel, relaxed, same time of day each week.'],
  ['Average daily steps', 'From your phone or watch.'],
  ['Training sessions completed', 'Completed / planned, e.g. 3 / 4.'],
  ['Nutrition adherence (%)', 'Roughly how many meals matched the plan.'],
  ['Hunger (1 to 5)', '1 never hungry, 5 hungry all day.'],
  ['Energy (1 to 5)', '1 exhausted, 5 excellent.'],
  ['Sleep (1 to 5)', '1 very poor, 5 excellent.'],
  ['Stress (1 to 5)', '1 very low, 5 very high.'],
];
const LONG: [string, string][] = [
  ['Challenges this week', ''],
  ['Wins this week', ''],
  ['What do you need help with?', ''],
];

export default function CheckInFormPrintPage() {
  return (
    <>
      <PrintToolbar title="Weekly check-in form" />
      <PrintSheet footerLeft="Weekly check-in" docTitle="Weekly check-in">
        <div className="mb-3">
          <h1 className="text-[16pt] font-extrabold">Weekly check-in</h1>
          <p className="text-[9.5pt] text-[var(--brand-stone-500)] mt-1">Fill in once a week, on the same day, and send a photo of this page to {BRAND.coachName} on WhatsApp or enter the numbers in the app.</p>
          <div className="grid grid-cols-2 gap-4 mt-2 text-[10pt]">
            <p>Name: <span className="inline-block w-48 border-b border-[var(--brand-charcoal)] align-bottom" /></p>
            <p>Week ending: <span className="inline-block w-36 border-b border-[var(--brand-charcoal)] align-bottom" /></p>
          </div>
        </div>
        <table className="w-full text-[9.5pt]">
          <tbody>
            {FIELDS.map(([k, hint]) => (
              <tr key={k} className="border-b border-line">
                <th scope="row" className="py-1.5 pr-3 text-left align-middle w-[46%]">
                  <span className="font-semibold">{k}</span>
                  <span className="block text-[8pt] font-normal leading-snug text-[var(--brand-stone-500)]">{hint}</span>
                </th>
                <td className="py-1.5"><div className="h-7 rounded-md border border-[var(--brand-stone-500)]/50" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-y-2.5 mt-3 text-[9.5pt]">
          {LONG.map(([k]) => (
            <div key={k}>
              <p className="font-semibold mb-1">{k}</p>
              <div className="h-12 rounded-md border border-[var(--brand-stone-500)]/50" />
            </div>
          ))}
        </div>
      </PrintSheet>
    </>
  );
}
