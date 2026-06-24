import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/primitives/Input/Input";

interface StatInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  min: number;
  max: number;
}

export function StatInput({ label, error, min, max, ...props }: StatInputProps) {
  return <Input {...props} error={error} helperText={`Valor entre ${min} y ${max}.`} inputMode="numeric" label={label} max={max} min={min} step={1} type="number" />;
}
