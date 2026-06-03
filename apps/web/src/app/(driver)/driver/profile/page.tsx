'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, FileText, User, Upload, LogOut, Check, Shield } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DriverProfile {
  name: string; email: string; phone: string;
  vehicle_make: string; vehicle_model: string; vehicle_year: string;
  vehicle_color: string; plate_number: string; license_number: string;
  is_verified: boolean; rating: number; total_trips: number;
}

export default function DriverProfilePage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ vehicle_color: '', plate_number: '' });

  useEffect(() => {
    api.get('/drivers/me').then(res => {
      const d = res.data?.data;
      setProfile(d);
      setForm({ vehicle_color: d?.vehicle_color ?? '', plate_number: d?.plate_number ?? '' });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/drivers/me', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); router.push('/login'); };

  const docItems = [
    { label: 'Licencia de conducir', key: 'license' },
    { label: 'Tarjeta de circulación', key: 'vehicle_doc' },
    { label: 'Identificación oficial', key: 'identity' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="safe-top px-4 pt-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link href="/driver" className="text-muted-foreground hover:text-white transition-colors"><ArrowLeft size={22} /></Link>
          <h1 className="font-black text-xl">Mi Perfil</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-5">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)
        ) : (
          <>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-cta flex items-center justify-center text-white font-black text-3xl mb-3 relative">
                {profile?.name?.[0]?.toUpperCase() ?? 'C'}
                {profile?.is_verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2ED573] flex items-center justify-center border-2 border-background">
                    <Shield size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="font-bold text-lg">{profile?.name}</div>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-center">
                  <div className="font-mono font-black text-primary">{profile?.rating?.toFixed(1) ?? '5.0'}</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center">
                  <div className="font-mono font-black text-secondary">{profile?.total_trips ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Viajes</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="bg-surface border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.04]">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Información personal</p>
              </div>
              {[
                { icon: <User size={14} />, label: profile?.name },
                { icon: <span className="text-xs">@</span>, label: profile?.email },
                { icon: <span className="text-xs">#</span>, label: profile?.phone },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.03] last:border-0">
                  <span className="text-muted-foreground w-4 flex items-center justify-center">{row.icon}</span>
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="bg-surface border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
                <Car size={14} className="text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehículo</p>
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-3 border-b border-white/[0.04]">
                <div><div className="text-xs text-[#4A4A5A]">Marca / Modelo</div><div className="text-sm font-medium">{profile?.vehicle_make} {profile?.vehicle_model}</div></div>
                <div><div className="text-xs text-[#4A4A5A]">Año</div><div className="text-sm font-medium">{profile?.vehicle_year}</div></div>
              </div>
              <div className="px-4 py-3 space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Color</label>
                  <input type="text" value={form.vehicle_color} onChange={e => setForm(f => ({ ...f, vehicle_color: e.target.value }))} className="w-full bg-surface-2 border border-white/[0.06] rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Placa</label>
                  <input type="text" value={form.plate_number} onChange={e => setForm(f => ({ ...f, plate_number: e.target.value.toUpperCase() }))} className="w-full bg-surface-2 border border-white/[0.06] rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/40 font-mono tracking-widest" />
                </div>
              </div>
            </motion.div>

            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} onClick={handleSave} disabled={saving} className="w-full py-3 rounded-2xl bg-gradient-cta font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <><Check size={16} /> Guardado</> : 'Guardar cambios'}
            </motion.button>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="bg-surface border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
                <FileText size={14} className="text-secondary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Documentos</p>
              </div>
              {docItems.map((doc, i) => (
                <div key={doc.key} className={`flex items-center justify-between px-4 py-3.5 ${i < docItems.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                  <div>
                    <div className="text-sm font-medium">{doc.label}</div>
                    <div className="text-xs text-[#2ED573] mt-0.5 flex items-center gap-1"><Check size={11} /> Subido</div>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 rounded-xl px-3 py-1.5">
                    <Upload size={12} /> Actualizar
                  </button>
                </div>
              ))}
            </motion.div>

            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} onClick={handleLogout} className="w-full py-3.5 rounded-2xl border border-red-500/20 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500/[0.06] transition-colors">
              <LogOut size={16} /> Cerrar sesión
            </motion.button>
          </>
        )}
      </div>
      <BottomNav role="driver" />
    </div>
  );
}
