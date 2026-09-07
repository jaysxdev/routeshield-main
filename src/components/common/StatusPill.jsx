import React from 'react';
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function StatusPill({ status, count = 0 }) {
  const { t } = useTranslation();

  if (status === 'resolved' || status === 'Resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        {t('status.resolved', 'Resolved')}
      </span>
    );
  }

  if (status === 'verified' || status === 'Verified' || count >= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <ShieldCheck className="w-3.5 h-3.5" />
        {t('status.communityVerified', 'Community Verified')} {count > 0 ? `(${count})` : ''}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
      <Clock className="w-3.5 h-3.5" />
      {t('status.unverified', 'Unverified')} {count > 0 ? `(${count})` : `(${t('status.pending', 'Pending')})`}
    </span>
  );
}
