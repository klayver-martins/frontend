'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { InputEmail } from '@/app/components/input-email';
import { InputPassword } from '@/app/components/input-password';
import { loginSchema, type LoginFormData } from '@/app/schemas/login-schema';
import { loginUser } from '@/app/services/auth/login-service';

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await loginUser(data);

      toast.success('Login realizado com sucesso!');
      router.replace('/home');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ocorreu um erro ao realizar o login.');
    }
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-2xl sm:p-10">
      {/* logo */}
      <div className="mb-6 flex flex-col items-center gap-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="none"
          className="h-20 w-20"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="8" y1="8" x2="56" y2="56">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.65" />
            </linearGradient>
          </defs>

          <rect x="3" y="3" width="58" height="58" rx="19" fill="url(#logo-gradient)" />

          <path
            d="M32 14L48 23V41L32 50L16 41V23L32 14Z"
            stroke="white"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />

          <path
            d="M16.5 23.5L32 32.5L47.5 23.5M32 32.5V49.5M24 18.5L40 27.5"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="45" cy="45" r="5" fill="white" />
          <path
            d="M43 45L44.5 46.5L47.5 43.5"
            stroke="var(--primary)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="text-base font-medium leading-relaxed tracking-wide text-white/90">
          Entre com suas credenciais.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputEmail registration={register('email')} error={errors.email?.message} />

        <InputPassword registration={register('password')} error={errors.password?.message} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar na conta'}

          {!isSubmitting && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Ainda não tem uma conta?{' '}
          <Link href="/register" className="font-semibold text-primary transition hover:opacity-80">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
