'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button, Field, Sheet, TextArea, toast } from '@/components/ui';

const EMPTY = { name: '', age: '', location: '', goalAchieved: '', startingWeightKg: '', endingWeightKg: '', durationWeeks: '12', quote: '', beforePhotoUrl: '', afterPhotoUrl: '', consentGiven: false };

/** Add a client story. Published to the public site immediately. */
export function AddTestimonial() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }));

  const save = async () => {
    if (!v.name.trim() || !v.goalAchieved.trim() || !v.quote.trim()) {
      setError('Name, result and quote are needed.');
      return;
    }
    if ((v.beforePhotoUrl || v.afterPhotoUrl) && !v.consentGiven) {
      setError('Photos need written consent. Tick the box or remove the photo links.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...v, beforePhotoUrl: v.beforePhotoUrl || null, afterPhotoUrl: v.afterPhotoUrl || null }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save the story.');
      toast('Story added', 'It now shows in the public results section.');
      setV(EMPTY);
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the story.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button size="sm" leading={<Plus size={14} />} onClick={() => setOpen(true)}>Add a story</Button>
      <Sheet open={open} onOpenChange={setOpen} title="Add a client story" description="Use the client's first name and city only." width="lg" footer={<Button full loading={busy} onClick={save}>Publish story</Button>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name"><input value={v.name} onChange={set('name')} autoComplete="off" /></Field>
            <Field label="City"><input value={v.location} onChange={set('location')} placeholder="Lagos" /></Field>
          </div>
          <Field label="Result" help="One line, e.g. Lost 11 kg and got stronger."><input value={v.goalAchieved} onChange={set('goalAchieved')} /></Field>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Age"><input value={v.age} onChange={set('age')} inputMode="numeric" /></Field>
            <Field label="Start" unit="kg"><input value={v.startingWeightKg} onChange={set('startingWeightKg')} inputMode="decimal" /></Field>
            <Field label="End" unit="kg"><input value={v.endingWeightKg} onChange={set('endingWeightKg')} inputMode="decimal" /></Field>
            <Field label="Weeks"><input value={v.durationWeeks} onChange={set('durationWeeks')} inputMode="numeric" /></Field>
          </div>
          <TextArea label="Quote" value={v.quote} onChange={set('quote')} placeholder="In the client's own words." />
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Before photo link" help="Optional."><input value={v.beforePhotoUrl} onChange={set('beforePhotoUrl')} inputMode="url" /></Field>
            <Field label="After photo link" help="Optional."><input value={v.afterPhotoUrl} onChange={set('afterPhotoUrl')} inputMode="url" /></Field>
          </div>
          <label className="flex items-start gap-3 t-body-sm cursor-pointer">
            <input type="checkbox" checked={v.consentGiven} onChange={(e) => setV((x) => ({ ...x, consentGiven: e.target.checked }))} className="mt-0.5 h-5 w-5 accent-[var(--brand)]" />
            I have the client&apos;s written consent to publish their photos.
          </label>
          {error && <p className="t-caption text-status-rejected" role="alert">{error}</p>}
        </div>
      </Sheet>
    </>
  );
}
