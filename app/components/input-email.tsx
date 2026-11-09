import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputEmailProps {
  registration: UseFormRegisterReturn;
  error?: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
}

export function InputEmail({
  registration,
  error,
  label = 'E-mail',
  placeholder = 'seu@email.com',
  autoComplete = 'email',
}: InputEmailProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={registration.name} className="text-sm font-medium text-foreground">
        {label}
      </label>

      <input
        id={registration.name}
        type="email"
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={`w-full rounded-xl border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 ${
          error
            ? 'border-destructive focus:ring-destructive/20'
            : 'border-border focus:border-primary focus:ring-primary/20'
        }`}
        {...registration}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
