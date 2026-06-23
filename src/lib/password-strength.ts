export type PasswordStrength = {
  score: number;
  label: string;
  color: string;
};

export function getPasswordStrength(pw: string): PasswordStrength {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Fraca', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Regular', color: 'bg-orange-400' };
  if (score <= 3) return { score, label: 'Boa', color: 'bg-yellow-400' };
  return { score, label: 'Forte', color: 'bg-emerald-500' };
}
