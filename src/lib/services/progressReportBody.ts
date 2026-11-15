const num = (v: unknown, d: number | null = null) => (v == null || v === '' || Number.isNaN(Number(v)) ? d : Number(v));
const text = (v: unknown) => (v == null ? '' : String(v));

/** Normalise a report form payload into Prisma data (shared by create and update). */
export function reportDataFromBody(body: any) {
  return {
    periodStart: new Date(body.periodStart),
    periodEnd: new Date(body.periodEnd),
    startingWeightKg: num(body.startingWeightKg, 0)!,
    currentWeightKg: num(body.currentWeightKg, 0)!,
    waistCm: num(body.waistCm, 0)!,
    averageSteps: num(body.averageSteps) == null ? null : Math.round(Number(body.averageSteps)),
    trainingConsistency: Math.round(num(body.trainingConsistency, 0)!),
    nutritionAdherence: Math.round(num(body.nutritionAdherence, 0)!),
    hunger: num(body.hunger),
    energy: num(body.energy),
    sleep: num(body.sleep),
    strengthPerformance: text(body.strengthPerformance) || null,
    challenges: text(body.challenges) || null,
    wins: text(body.wins) || null,
    coachAssessment: text(body.coachAssessment),
    nextAdjustments: text(body.nextAdjustments),
  };
}
