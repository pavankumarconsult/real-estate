import { FormEvent, useState } from 'react';
import { AlertCircle, ArrowRight, Building2, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';

interface AdminSignInProps {
  errorMessage: string;
  isSubmitting: boolean;
  onSubmit: (email: string, password: string, remember: boolean) => Promise<void>;
}

export function AdminSignIn({ errorMessage, isSubmitting, onSubmit }: AdminSignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password || isSubmitting) return;
    await onSubmit(email.trim(), password, remember);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fff8f5] text-[#1e1b19]">
      <header className="border-b border-[#d2c5b3]/60 bg-white">
        <div className="mx-auto flex h-20 w-full max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-3 text-[#1e1b19]">
            <span className="flex h-10 w-10 items-center justify-center rounded border border-[#d2c5b3] bg-[#faf2ee] font-serif text-xl text-[#775610]">T4</span>
            <span>
              <span className="block font-serif text-xl font-semibold sm:text-2xl">Team4 Aria</span>
              <span className="hidden text-xs tracking-wide text-[#635d5c] sm:block">Private enquiry administration</span>
            </span>
          </a>
          <span className="inline-flex items-center gap-2 rounded bg-[#f4ece8] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#635d5c]">
            <LockKeyhole className="h-3.5 w-3.5 text-[#775610]" aria-hidden="true" /> Restricted access
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-xl border border-[#d2c5b3]/80 bg-white shadow-[0_18px_48px_rgba(28,25,23,0.08)]">
          <div className="h-1.5 bg-gradient-to-r from-[#775610] via-[#a37e36] to-[#ecc071]" />
          <div className="p-6 sm:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#d2c5b3] bg-[#faf2ee] text-[#775610]">
                <Building2 className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#775610]">Team4 Aria</p>
              <h1 className="mt-2 font-serif text-3xl font-semibold text-[#1e1b19] sm:text-4xl">Enquiry Admin Desk</h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#635d5c]">Sign in with a Firebase Authentication account whose UID has been explicitly approved on the server.</p>
            </div>

            {errorMessage && (
              <div role="alert" className="mt-7 flex items-start gap-3 rounded border border-[#ba1a1a]/35 bg-[#ffdad6]/55 p-4 text-sm text-[#93000a]">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Unable to sign in</p>
                  <p className="mt-1 leading-5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="admin-email" className="block text-sm font-semibold text-[#1e1b19]">Admin email</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#807666]" aria-hidden="true" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded border border-[#d2c5b3] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#775610]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-semibold text-[#1e1b19]">Password</label>
                <div className="relative mt-2">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#807666]" aria-hidden="true" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded border border-[#d2c5b3] bg-white py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#775610]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#807666] hover:text-[#1e1b19]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 rounded border border-[#d2c5b3]/60 bg-[#faf2ee] p-3.5 text-sm text-[#4e4638]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#775610]"
                />
                <span>
                  <span className="block font-semibold text-[#1e1b19]">Keep me signed in on this device</span>
                  <span className="mt-0.5 block text-xs leading-5">Leave unchecked on a shared device.</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || !email.trim() || !password}
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#775610] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#926f28] disabled:cursor-not-allowed disabled:bg-[#807666]"
              >
                {isSubmitting ? 'Verifying account…' : 'Sign in to admin'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </form>

            <div className="mt-7 border-t border-[#d2c5b3]/55 pt-5 text-center text-xs leading-5 text-[#635d5c]">
              Authentication alone does not grant access. The server verifies the signed-in account against the approved UID allowlist on every admin request.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
