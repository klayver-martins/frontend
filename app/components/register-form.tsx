'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { registerSchema, type RegisterFormData } from '@/app/schemas/register-schema';

import { InputEmail } from '@/app/components/input-email';
import { InputPassword } from '@/app/components/input-password';

import { loginUser } from '@/app/services/auth/login-service';
import { registerUser } from '@/app/services/auth/register-service';

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: RegisterFormData) {
    // Primeiro, cria a conta.
    try {
      await registerUser(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ocorreu um erro ao criar sua conta.');

      return;
    }

    // Depois, tenta fazer login automaticamente.
    try {
      await loginUser({
        email: data.email,
        password: data.password,
      });

      toast.success('Conta criada com sucesso! Bem-vindo!');
      window.location.replace('/home');
    } catch {
      toast.warning(
        'Sua conta foi criada, mas não foi possível entrar automaticamente. Faça login para continuar.',
      );

      window.location.replace('/login');
    }
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-2xl sm:p-10">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Crie sua conta</h1>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Preencha seus dados para começar.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nome
          </label>

          <input
            id="name"
            type="text"
            placeholder="Seu nome"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={`w-full rounded-xl border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 ${
              errors.name
                ? 'border-destructive focus:ring-destructive/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            }`}
            {...register('name')}
          />

          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <InputEmail registration={register('email')} error={errors.email?.message} />

        {/* Password */}
        <InputPassword
          registration={register('password')}
          error={errors.password?.message}
          label="Senha"
          placeholder="Crie uma senha"
          autoComplete="new-password"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}

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

      {/* Footer */}
      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Já possui uma conta?{' '}
          <Link href="/login" className="font-semibold text-primary transition hover:opacity-80">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
