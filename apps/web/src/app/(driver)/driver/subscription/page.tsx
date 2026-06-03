'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertCircle, ArrowLeft, ExternalLink, Zap } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useDriverStore } from '@/store/driverStore';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Plan {
  id: string; name: string; amount: number; currency: string;
  interval: string; tripFeeAmount: number; features: string[];
}

interface SubStatus {
  stripe_subscription_id: string | null;
  subscription_status: string;
  subscription_period_end: string | null;
}

export default function SubscriptionPage() {
  const { subscriptionStatus, setSubscriptionStatus } = useDriverStore();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/subscriptions/plans'),
      api.get('/subscriptions/me'),
    ]).then(([plansRes, subRes]) => {
      setPlan(plansRes.data?.data?.[0] ?? null);
      setSub(subRes.data?.data ?? null);
      if (subRes.data?.data?.subscription_status) setSubscriptionStatus(subRes.data.data.subscription_status);
    }).catch(() => {}).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await api.post('/subscriptions/portal');
      window.location.href = res.data?.data?.url;
    } catch {
      alert('No se pudo abrir el portal de pagos');
    } finally {
      setPortalLoading(false);
    }
  };

  const isActive = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
  const isPastDue = subscriptionStatus === 'past_due';

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="safe-top px-4 pt-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link href="/driver" className="text-muted-foreground hover:text-white transition-colors"><ArrowLeft size={22} /></Link>
          <h1 className="font-black text-xl">Mi Suscripción</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-2xl border ${
              isActive ? 'bg-[#2ED573]/[0.08] border-[#2ED573]/25'
              : isPastDue ? 'bg-red-500/[0.08] border-red-500/25'
              : 'bg-[#FFA502]/[0.08] border-[#FFA502]/25'
            }`}
          >
            {isActive
              ? <CheckCircle size={20} className="text-[#2ED573]" />
              : <AlertCircle size={20} className={isPastDue ? 'text-red-500' : 'text-[#FFA502]'} />
            }
            <div>
              <div className={`font-semibold text-sm ${isActive ? 'text-[#2ED573]' : isPastDue ? 'text-red-500' : 'text-[#FFA502]'}`}>
                {isActive ? 'Suscripción activa' : isPastDue ? 'Pago fallido' : 'Sin suscripción activa'}
              </div>
              {sub?.subscription_period_end && isActive && (
                <div className="text-xs text-muted-foreground mt-0.5">Renueva: {new Date(sub.subscription_period_end).toLocaleDateString('es')}</div>
              )}
            </div>
          </motion.div>
        )}

        {plan && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-primary/20 rounded-3xl overflow-hidden">
            <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, rgb(var(--color-primary-rgb)/0.15), rgb(var(--color-secondary-rgb)/0.08))' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">{plan.name}</div>
                  <div className="text-xs text-muted-foreground">por {plan.interval}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black font-mono gradient-text">${plan.amount}</div>
                  <div className="text-xs text-muted-foreground">{plan.currency}</div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2.5">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {isActive ? (
          <button
            onClick={handlePortal} disabled={portalLoading}
            className="w-full py-4 rounded-2xl border border-white/10 font-semibold flex items-center justify-center gap-2 hover:border-primary/30 transition-colors disabled:opacity-50"
          >
            {portalLoading
              ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              : <><CreditCard size={18} /> Gestionar suscripción <ExternalLink size={14} className="text-muted-foreground" /></>}
          </button>
        ) : (
          <Link href="/driver/subscription/checkout" className="w-full py-4 rounded-2xl bg-gradient-cta font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Zap size={18} /> Activar suscripción
          </Link>
        )}
      </div>
      <BottomNav role="driver" />
    </div>
  );
}
