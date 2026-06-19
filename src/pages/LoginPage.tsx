import { useAuth } from "../context/AuthContext";
import { Tv2, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { signInWithGoogle, error, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      {/* Arka plan dekoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl mb-6">
          <Tv2 className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-1">AniTrack</h1>
        <p className="text-purple-300 text-sm mb-8">
          Anime Çeviri Takip Sistemi
        </p>

        <div className="bg-white/5 rounded-2xl p-4 mb-8 text-left space-y-2">
          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
            Bu uygulamada:
          </p>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>✅ Gerçek zamanlı bölüm durumu takibi</li>
            <li>✅ Çeviri, kontrol, dizgi, encode, yayın kolonları</li>
            <li>✅ İlerleme yüzdesi ve genel seri durumu</li>
            <li>✅ Ekip ile paylaşımlı düzenleme</li>
          </ul>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-xl p-3 mb-4 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold rounded-2xl px-6 py-4 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Google SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <LogIn className="w-4 h-4" />
          Google ile Giriş Yap
        </button>

        <p className="text-xs text-slate-500 mt-6">
          Sadece yetkili Google hesapları erişebilir.
          <br />
          Erişim için yöneticiye başvurun.
        </p>
      </div>
    </div>
  );
}
