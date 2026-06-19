import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import NotAllowedPage from "./pages/NotAllowedPage";
import DashboardPage from "./pages/DashboardPage";
import FirebaseConfigPage from "./pages/FirebaseConfigPage";
import { IS_DEMO_MODE } from "./firebase";
import { Loader2 } from "lucide-react";

function AppInner() {
  const { user, loading, isAllowed } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Yükleniyor…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!isAllowed) {
    return <NotAllowedPage />;
  }

  return <DashboardPage />;
}

export default function App() {
  // Demo modunda Firebase yapılandırma sayfasını göster
  if (IS_DEMO_MODE) {
    return <FirebaseConfigPage />;
  }

  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
