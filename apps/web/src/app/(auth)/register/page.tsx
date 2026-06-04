'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Eye, EyeOff, Car, User, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'RideMe';

type Role = 'passenger' | 'driver';

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<Role>((params.get('role') as Role) || 'passenger');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();

  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name: `${form.firstName} ${form.lastName}`.trim(), phone: form.phone, email: form.email, password: form.password, role });
      router.push(role === 'driver' ? '/driver' : '/app');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.05] blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-cta flex items-center justify-center">
            <MapPin size={16} className="text-white" />
          </div>
          <span className="font-black text-2xl">{APP_NAME}</span>
        </Link>

        <div className="bg-surface border border-white/[0.06] rounded-3xl p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-4 text-center">Quiero registrarme como:</p>
          <div className="grid grid-cols-2 gap-3">
            {([['passenger', User, 'Pasajero'], ['driver', Car, 'Chofer']] as const).map(([r, Icon, label]) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  role === r
                    ? 'border-primary bg-primary/10'
                    : 'border-white/[0.06] hover:border-primary/30'
                }`}
              >
                <Icon size={24} className={role === r ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`font-semibold text-sm ${role === r ? 'text-white' : 'text-muted-foreground'}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-white/[0.06] rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Crear cuenta</h2>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm text-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[['firstName', 'Nombre'], ['lastName', 'Apellido']].map(([name, label]) => (
                <div key={name}>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{label}</label>
                  <input
                    name={name} value={form[name as keyof typeof form]} onChange={handleChange}
                    required placeholder={label}
                    className="input-dark w-full px-4 py-3 text-sm"
                  />
                </div>
              ))}
            </div>

            {[
              { name: 'phone', label: 'Teléfono', type: 'tel', placeholder: '+52 55 0000 0000' },
              { name: 'email', label: 'Email (opcional)', type: 'email', placeholder: 'tu@email.com' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs text-muted-foreground mb-1.5 font-medium">{label}</label>
                <input
                  name={name} value={form[name as keyof typeof form]} onChange={handleChange}
                  type={type} placeholder={placeholder} required={name !== 'email'}
                  className="input-dark w-full px-4 py-3 text-sm"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Contraseña</label>
              <div className="relative">
                <input
                  name="password" value={form.password} onChange={handleChange}
                  type={showPwd ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                  required minLength={8}
                  className="input-dark w-full px-4 py-3 pr-12 text-sm"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white p-1">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-cta font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>{role === 'driver' ? 'Continuar registro' : 'Crear mi cuenta'} <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:text-secondary font-medium transition-colors">Iniciar sesión</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RegisterForm />
    </Suspense>
  );
}
