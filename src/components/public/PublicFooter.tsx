import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-[#05080d] border-t border-white/10 text-slate-400 text-xs py-14 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-sm">
                <Flame className="w-4 h-4 fill-slate-950 stroke-none" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">FITNESS POLICE</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Human-in-the-Loop fitness transformation platform combining Mifflin-St Jeor metabolic engines, cultural nutrition logging, and personalized coaching.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-sky-400 font-semibold pt-1">
              <ShieldCheck size={14} /> Head Coach: Lekan Adeyemi (Lagos, Nigeria)
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider">Product Journey</p>
            <ul className="space-y-2">
              <li><a href="#transformation" className="hover:text-white transition-colors">Transformation</a></li>
              <li><a href="#fitness" className="hover:text-white transition-colors">Fitness Police Hub</a></li>
              <li><a href="#nutrition" className="hover:text-white transition-colors">Free Food Police</a></li>
              <li><a href="#tracking" className="hover:text-white transition-colors">Progress & Photos</a></li>
              <li><a href="#coaching" className="hover:text-white transition-colors">Weekly Check-Ins</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider">Access & Legal</p>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-white transition-colors">Client Account Log In</Link></li>
              <li><Link href="/onboarding" className="hover:text-white transition-colors">Start 14-Day Free Trial</Link></li>
              <li><Link href="/login?role=coach" className="hover:text-white transition-colors">Coach Console Access</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Coaching Memberships</a></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-white/10 space-y-3 text-[11px] text-slate-400">
          <p className="leading-relaxed">
            <strong>Medical & Nutritional Disclaimer:</strong> Fitness Police and Food Police are designed for educational, habit building, and fitness coaching purposes. All calorie targets, macro ratios, and meal suggestions are approximations based on the Mifflin-St Jeor equation and are not a substitute for professional medical advice, diagnosis, or clinical dietary treatment. Consult your physician before initiating any vigorous exercise program or calorie deficit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-slate-400">
            <p>© {new Date().getFullYear()} Fitness Police Coaching Platform. All rights reserved.</p>
            <p>Designed with precision, human empathy, and science.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
