import type { Metadata } from 'next';
import { resolvePhoto } from '@/lib/photos';
import { OnboardingFlow } from './OnboardingFlow';

export const metadata: Metadata = { title: 'Start your assessment' };

export default function OnboardingPage() {
  return <OnboardingFlow reviewPhoto={resolvePhoto('onboarding')} />;
}
