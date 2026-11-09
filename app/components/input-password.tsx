'use client';

import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputPasswordProps {
  registration: UseFormRegisterReturn;
  error?: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
}

export function InputPassword({
  registration,
  error,
  label = 'Senha',
  placeholder = 'Digite sua senha',
  autoComplete = 'current-password',
}: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={registration.name} className="text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="relative">
        <input
          id={registration.name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className={`w-full rounded-xl border bg-background px-4 py-3.5 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 ${
            error
              ? 'border-destructive focus:ring-destructive/20'
              : 'border-border focus:border-primary focus:ring-primary/20'
          }`}
          {...registration}
        />

        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={showPassword}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.3 2.3-2.5 3.4M6.2 6.2C3.8 7.8 2.7 10 2.5 12c.5 1.3 2.2 4.2 6.1 5.9 1.1.5 2.2.8 3.4.9"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
