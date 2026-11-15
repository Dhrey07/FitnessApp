'use client';

import React, { useState, useEffect } from 'react';
import { ClientAppShell } from '@/components/client/ClientAppShell';
import {
  TrendingUp,
  Camera,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PhotoPlaceholder } from '@/components/brand/PhotoPlaceholder';

export default function ProgressClientPage() {
  const [user, setUser] = useState<any>(null);
  const [newWeight, setNewWeight] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [chartData, setChartData] = useState([
    { date: 'Baseline', weight: 86.5, waist: 89.5 },
    { date: 'Week 1', weight: 85.8, waist: 89.0 },
    { date: 'Week 2', weight: 85.0, waist: 88.0 },
    { date: 'Week 3', weight: 84.2, waist: 87.0 },
  ]);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || !newWaist) return;

    const entry = {
      date: `Week ${chartData.length}`,
      weight: parseFloat(newWeight),
      waist: parseFloat(newWaist),
    };

    setChartData([...chartData, entry]);
    setSuccessMsg(`Logged: ${newWeight}kg and ${newWaist}cm waistline!`);
    setNewWeight('');
    setNewWaist('');
    setNotes('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const currentWeight = user?.profile?.weightKg || 84.2;
  const startingWeight = 86.5;
  const weightDelta = (currentWeight - startingWeight).toFixed(1);

  return (
    <ClientAppShell
      title="Transformation Progress Tracker"
      subtitle="Track your weight trajectory, waist reduction, and weekly milestone records."
    >
      {successMsg && (
        <div className="p-4 rounded-xl bg-status-approved/15 border border-status-approved/40 text-status-approved text-xs flex items-center gap-2 animate-fade-in w-full">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="surface p-5 space-y-1 border border-[var(--border-subtle)]">
          <span className="label-xs text-[var(--text-muted)]">Starting Baseline</span>
          <p className="text-2xl font-black text-[var(--text-heading)]">{startingWeight} <span className="text-xs font-normal text-[var(--text-muted)]">kg</span></p>
          <p className="text-xs text-[var(--text-muted)]">Day 1 Initial Assessment</p>
        </div>

        <div className="surface p-5 space-y-1 border border-line-active">
          <span className="label-xs text-brand">Current Weight</span>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-brand">{currentWeight} <span className="text-xs font-normal text-[var(--text-muted)]">kg</span></p>
            <span className="text-xs font-bold text-brand">{weightDelta}kg</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Week 4 Active Tracking</p>
        </div>

        <div className="surface p-5 space-y-1 border border-line-active">
          <span className="label-xs text-brand">Waistline</span>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-brand">{user?.profile?.waistCm || 87.0} <span className="text-xs font-normal text-[var(--text-muted)]">cm</span></p>
            <span className="text-xs font-bold text-brand">-2.5cm</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Abdominal Fat Reduction</p>
        </div>
      </div>

      {/* RECHARTS TREND VISUALIZER */}
      <div className="surface p-6 sm:p-7 space-y-4 border border-[var(--border-subtle)] w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h3 className="section-title text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-brand" /> Body Mass & Waist Trend (4-Week History)
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Automated smoothing filters day-to-day water retention fluctuations.</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-brand">
              <span className="w-3 h-3 rounded-full bg-brand-strong inline-block" /> Weight (kg)
            </span>
            <span className="flex items-center gap-1.5 text-brand">
              <span className="w-3 h-3 rounded-full bg-brand-strong inline-block" /> Waist (cm)
            </span>
          </div>
        </div>

        <div className="h-60 sm:h-72 w-full pt-4 overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
              <YAxis domain={[80, 95]} stroke="var(--text-muted)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderRadius: '12px',
                  color: 'var(--text-heading)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
                stroke="var(--brand)"
                strokeWidth={3}
                dot={{ r: 5, fill: 'var(--brand)' }}
              />
              <Line
                type="monotone"
                dataKey="waist"
                name="Waist (cm)"
                stroke="var(--accent)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: 'var(--accent)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column: Quick Record Logger & Progress Photo Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Record New Entry Form */}
        <div className="lg:col-span-6 surface p-6 space-y-4 border border-[var(--border-subtle)]">
          <div>
            <span className="label-xs text-brand">Metric Logger</span>
            <h3 className="text-base font-bold text-[var(--text-heading)] mt-1">Log Today&apos;s Measurements</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Weigh yourself first thing in the morning for maximum consistency.</p>
          </div>

          <form onSubmit={handleAddMeasurement} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g. 83.8"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Waist (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newWaist}
                  onChange={(e) => setNewWaist(e.target.value)}
                  placeholder="e.g. 86.5"
                  className="field-input"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Feeling lean, good energy after leg day"
                className="field-input text-xs"
              />
            </div>

            <button
              type="submit"
              className="btn-brand text-xs w-full justify-center py-3 font-extrabold"
            >
              <Plus size={15} /> Save Measurement Record
            </button>
          </form>
        </div>

        {/* Progress Photos Gallery */}
        <div className="lg:col-span-6 surface p-6 space-y-4 border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="label-xs text-brand">Visual Verification</span>
              <h3 className="text-base font-bold text-[var(--text-heading)] mt-1">Weekly Progress Photos</h3>
            </div>
            <span className="badge text-xs bg-paper border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              <Camera size={11} /> 3 Photos
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 text-center">
              <PhotoPlaceholder aspect="h-32" label="Week 1 photo" />
              <span className="text-xs font-bold text-[var(--text-muted)]">Week 1 (86.5kg)</span>
            </div>
            <div className="space-y-1 text-center">
              <PhotoPlaceholder aspect="h-32" label="Week 2 photo" />
              <span className="text-xs font-bold text-[var(--text-muted)]">Week 2 (85.0kg)</span>
            </div>
            <div className="space-y-1 text-center">
              <PhotoPlaceholder aspect="h-32" label="Week 3 photo" />
              <span className="text-xs font-bold text-brand">Week 3 (84.2kg)</span>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Add a progress photo with your weekly check-in. Photos are private to you and your coach.
          </p>
        </div>

      </div>
    </ClientAppShell>
  );
}
