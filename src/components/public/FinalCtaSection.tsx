import React from 'react';
import { Button } from '@/components/ui';
import { BRAND } from '@/lib/brand';
import { whatsappLink } from '@/lib/whatsapp';

export function FinalCtaSection() {
  const wa = whatsappLink(BRAND.contact.whatsapp, `Hello ${BRAND.coachName}, I would like to ask about coaching.`);
  return (
    <section className="pub-section bg-surface">
      <div className="pub-container">
        <div className="pub-reading">
          <h2 className="t-display">Start with a five-minute assessment.</h2>
          <p className="t-body text-ink-secondary mt-5">You get your calorie and protein targets straight away. If you choose a coaching plan, the first 14 days are free.</p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <Button href="/onboarding" size="lg">Start your assessment</Button>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="t-ui text-ink hover:text-brand transition-colors">
                Or ask a question on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
