import React from 'react';
import { Download } from 'lucide-react';
import { Button, Document, DocumentRow, EmptyState, Menu } from '@/components/ui';

export interface ClientReport {
  id: string;
  periodStart: string;
  periodEnd: string;
  startingWeightKg: number;
  currentWeightKg: number;
  waistCm: number;
  trainingConsistency: number;
  nutritionAdherence: number;
  coachAssessment: string;
  nextAdjustments: string;
}

const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Published progress reports as Documents. Private Coaching only. */
export function ProgressReportsList({ reports, entitled, clientName }: { reports: ClientReport[]; entitled: boolean; clientName: string }) {
  if (!entitled) {
    return (
      <EmptyState
        message="Monthly progress reports, with a written assessment and the next adjustments, come with Private Coaching."
        action={<Button href="/client/profile#membership" size="sm" variant="secondary">See plans</Button>}
      />
    );
  }
  if (reports.length === 0) return <EmptyState message="Your coach publishes a progress report at the end of each month. It will appear here." />;

  return (
    <div className="space-y-6">
      {reports.map((r) => {
        const change = Math.round((r.currentWeightKg - r.startingWeightKg) * 10) / 10;
        return (
          <div key={r.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="t-ui">{fmt(r.periodStart)} to {fmt(r.periodEnd)}</p>
              <Menu items={[{ label: 'Download PDF', icon: <Download size={16} />, href: `/print/progress-report/${r.id}?autoprint=1` }]} label="Report options" />
            </div>
            <Document title="Progress report" subtitle={`${fmt(r.periodStart)} to ${fmt(r.periodEnd)}`} meta={<>{clientName}</>}>
              <DocumentRow label="Weight" value={`${r.currentWeightKg} kg · ${change > 0 ? 'up' : 'down'} ${Math.abs(change)}`} />
              <DocumentRow label="Waist" value={`${r.waistCm} cm`} />
              <DocumentRow label="Training consistency" value={`${r.trainingConsistency}%`} />
              <DocumentRow label="Nutrition adherence" value={`${r.nutritionAdherence}%`} />
              <DocumentRow label="Coach assessment">
                <p className="text-sm leading-relaxed mt-1">{r.coachAssessment}</p>
              </DocumentRow>
              <DocumentRow label="Next adjustments">
                <p className="text-sm leading-relaxed mt-1">{r.nextAdjustments}</p>
              </DocumentRow>
            </Document>
          </div>
        );
      })}
    </div>
  );
}
