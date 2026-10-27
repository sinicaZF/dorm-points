import { forwardRef } from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  hint?: string;
  placeholder?: string;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ label, value, onChange, min = 0, max, suffix, hint, placeholder }, ref) => {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="relative">
          <input
            ref={ref}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={value === 0 ? '' : value}
            placeholder={placeholder ?? '0'}
            onChange={(e) => {
              const v = e.target.value === '' ? 0 : Math.max(min, Number(e.target.value));
              if (max !== undefined) onChange(Math.min(max, v));
              else onChange(v);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
          {suffix && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              {suffix}
            </span>
          )}
        </div>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </label>
    );
  },
);
NumberField.displayName = 'NumberField';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, value, onChange, placeholder }, ref) => {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <input
          ref={ref}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </label>
    );
  },
);
TextField.displayName = 'TextField';
