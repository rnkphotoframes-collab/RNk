import { useState } from 'react';
import { Shield, Lock, Mail, AlertCircle, Key, ArrowRight } from 'lucide-react';
import { adminLogin } from '../../lib/api.js';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export default function AdminLogin({ onLoginSuccess, onNavigateHome }: AdminLoginProps) {
  const [email, setEmail] = useState('rnkphotoframes@gmail.com');
  const [password, setPassword] = useState('RNK@Frames2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelper, setShowHelper] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await adminLogin(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify your admin email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#1C1917] text-[#C5A880] rounded-xl flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1C1917]">
            RNK Admin Portal
          </h2>
          <p className="text-xs text-[#57534E]">
            Secure portal for RNK Photo Frames catalogue & enquiry management.
          </p>
        </div>

        {/* Credentials helper card */}
        {showHelper && (
          <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[#C5A880]/50 text-xs text-stone-700 space-y-1 relative">
            <button
              onClick={() => setShowHelper(false)}
              className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ×
            </button>
            <div className="flex items-center gap-1.5 font-bold text-[#997A4D]">
              <Key className="w-3.5 h-3.5" />
              <span>Admin Access Information:</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Authorized Email: <strong className="text-stone-900 font-mono">rnkphotoframes@gmail.com</strong>
            </p>
            <p className="text-[11px] text-stone-600">
              Default Setup Password: <strong className="text-stone-900 font-mono">RNK@Frames2026</strong>
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E8E2D5] shadow-lg space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-md bg-[#FAF8F5] border border-[#D8D0C0] text-xs text-[#1C1917] focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-[#1C1917] hover:bg-stone-800 text-white font-semibold text-xs tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              <span>{isLoading ? 'Verifying Session...' : 'Authenticate & Enter Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-[#F4F0E8]">
            <button
              onClick={onNavigateHome}
              className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              ← Return to Public Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
