'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { InputEmail } from '@/app/components/input-email';
import { InputPassword } from '@/app/components/input-password';
import { loginSchema, type LoginFormData } from '@/app/schemas/login-schema';
import { loginUser } from '@/app/services/auth/login-service';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await loginUser(data);
      toast.success('Login realizado com sucesso!');
      // A navegação completa garante que a próxima página valide a sessão
      // já com os cookies HTTP-only recebidos pela API.
      window.location.replace('/home');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ocorreu um erro ao realizar o login.');
    }
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-2xl sm:p-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo de volta</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Entre com suas credenciais para acessar sua conta.
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
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
