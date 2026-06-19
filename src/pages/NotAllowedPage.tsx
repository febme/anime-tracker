import { useAuth } from "../context/AuthContext";
import { ShieldX, LogOut } from "lucide-react";

export default function NotAllowedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 mb-6">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Erişim Reddedildi</h2>
        <p className="text-slate-400 mb-4">
          <span className="text-red-400 font-medium">{user?.email}</span> adresinin
          bu uygulamaya erişim izni bulunmuyor.
        </p>
        <p className="text-sm text-slate-500 mb-8">
          Erişim için yöneticiye başvurun.
        </p>
        <button
          onClick={logout}
          className="flex items-center gap-2 mx-auto bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-xl px-6 py-3 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
