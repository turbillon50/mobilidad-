'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Phone, Mail, CreditCard, Plus, Trash2, Check, LogOut } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/payments/methods').then(res => {
      setMethods(res.data?.data ?? []);
    }).catch(() => {}).finally(() => setLoadingMethods(false));
  }, []);

  useEffect(() => {
    setName(user?.name ?? '');
  }, [user?.name]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/users/me', { name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    await api.put(`/payments/methods/${id}/default`).catch(() => {});
    setMethods(prev => prev.map(m => ({ ...m, is_default: m.id === id })));
  };

  const handleRemove = async (id: string) => {
    await api.delete(`/payments/methods/${id}`).catch(() => {});
    setMethods(prev => prev.filter(m => m.id !== id));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const brandIcon: Record<string, string> = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="safe-top px-4 pt-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="font-black text-xl">Mi Perfil</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-5">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-cta flex items-center justify-center text-white font-black text-3xl mb-3">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="text-xs text-muted-foreground">Usuario</div>
        </motion.div>

        {/* Personal info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="bg-surface border border-white/[0.06] rounded-2xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/[0.04]">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Información personal</p>
          </div>
          <div className="space-y-0">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.04]">
              <User size={15} className="text-primary flex-shrink-0" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.04]">
              <Mail size={15} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Phone size={15} className="text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{user?.phone ?? 'Sin teléfono'}</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onClick={handleSave}
          disabled={saving || name === user?.name}
          className="w-full py-3 rounded-2xl bg-gradient-cta font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <><Check size={16} /> Guardado</>
          ) : (
            'Guardar cambios'
          )}
        </motion.button>

        {/* Payment methods */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-surface border border-white/[0.06] rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Métodos de pago</p>
            <button className="flex items-center gap-1 text-xs text-primary">
              <Plus size={13} /> Agregar
            </button>
          </div>

          {loadingMethods ? (
            <div className="p-4 space-y-2">
              {[1, 2].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}
            </div>
          ) : methods.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <CreditCard size={28} className="text-[#4A4A5A] mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Sin tarjetas guardadas</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {methods.map(m => (
                <div key={m.id} className="flex items-center gap-3 px-4 py-3.5">
                  <span className="text-xl">{brandIcon[m.brand] ?? '💳'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium capitalize">{m.brand} ···· {m.last4}</div>
                    <div className="text-xs text-[#4A4A5A]">Vence {m.exp_month}/{m.exp_year}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.is_default ? (
                      <span className="text-xs text-[#2ED573] font-medium">Principal</span>
                    ) : (
                      <button onClick={() => handleSetDefault(m.id)} className="text-xs text-primary">
                        Usar
                      </button>
                    )}
                    <button onClick={() => handleRemove(m.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} className="text-[#4A4A5A] hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.24 }}
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-red-500/20 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500/[0.06] transition-colors"
        >
          <LogOut size={16} /> Cerrar sesión
        </motion.button>
      </div>

      <BottomNav role="passenger" />
    </div>
  );
}
