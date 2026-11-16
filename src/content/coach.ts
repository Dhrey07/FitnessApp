import { BRAND } from '@/lib/brand';

/**
 * Coach section copy. Edit here, not in the component. Keep claims to
 * things that are true of the practice; add formal qualifications to
 * `credentials` only when they can be shown.
 */
export const COACH = {
  name: BRAND.coachName,
  role: `Head coach, ${BRAND.legalName}`,
  paragraphs: [
    'Eric coaches adults who want a leaner, stronger body without giving up the food and routines that make up a normal life. The method is deliberately plain: clear quantities, a protein target, a training programme that fits the equipment you actually have, and a weekly check-in he reads himself.',
    'Most clients arrive after years of starting over. The work is to make the next twelve weeks different: fewer rules, better numbers, and someone who notices when a week goes sideways and tells you what to change on Sunday night, not a month later.',
  ],
  credentials: [
    'Nutrition built around Nigerian and international foods',
    'Every weekly check-in reviewed personally, with written feedback',
    'Clients coached in Nigeria and internationally, online',
  ],
  where: 'Based in Lagos. Coaching online, with in-person sessions by arrangement.',
} as const;
