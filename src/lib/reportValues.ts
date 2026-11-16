/** Progress report field values, shared by the server pages and the client editor. */

export type ReportValues = {
  periodStart: string; periodEnd: string;
  startingWeightKg: string; currentWeightKg: string; waistCm: string; averageSteps: string;
  trainingConsistency: string; nutritionAdherence: string;
  hunger: string; energy: string; sleep: string;
  strengthPerformance: string; challenges: string; wins: string;
  coachAssessment: string; nextAdjustments: string;
};

export const emptyReport: ReportValues = {
  periodStart: '', periodEnd: '', startingWeightKg: '', currentWeightKg: '', waistCm: '', averageSteps: '',
  trainingConsistency: '', nutritionAdherence: '', hunger: '', energy: '', sleep: '',
  strengthPerformance: '', challenges: '', wins: '', coachAssessment: '', nextAdjustments: '',
};

export function toValues(src: unknown): ReportValues {
  const v = { ...emptyReport };
  const o = (src ?? {}) as Record<string, unknown>;
  (Object.keys(v) as (keyof ReportValues)[]).forEach((k) => {
    const x = o[k];
    if (x == null) return;
    if (k === 'periodStart' || k === 'periodEnd') v[k] = (x instanceof Date ? x.toISOString() : String(x)).slice(0, 10);
    else if (typeof x === 'number') v[k] = String(Math.round(x * 10) / 10);
    else v[k] = String(x);
  });
  return v;
}
