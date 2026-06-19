import { useState } from "react";
import { Settings, Copy, Check, ExternalLink, AlertTriangle } from "lucide-react";

/**
 * Bu sayfa, kullanıcıya Firebase projesini nasıl kuracağını gösterir
 * ve src/firebase.ts dosyasını düzenlemelerini söyler.
 * Firebase config değerleri DEMO olduğunda bu sayfa gösterilir.
 */
export default function FirebaseConfigPage() {
  const [copied, setCopied] = useState(false);

  const configTemplate = `// src/firebase.ts içine yapıştırın:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId: "YOUR_APP_ID",
};

// İzin verilen mailler:
export const ALLOWED_EMAILS: string[] = [
  "sizin@gmail.com",
  "ekip@gmail.com",
];

// Admin mailler:
export const ADMIN_EMAILS: string[] = [
  "sizin@gmail.com",
];`;

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /series/{seriesId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth.token.email in
        ['admin@gmail.com']; // admin maili
    }
  }
}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Settings className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Firebase Kurulumu</h1>
            <p className="text-slate-400 text-sm">
              Uygulamayı kullanabilmek için Firebase projenizi bağlayın
            </p>
          </div>
        </div>

        {/* Uyarı */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 mb-8 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-orange-300 font-medium text-sm">
              Demo Firebase yapılandırması tespit edildi
            </p>
            <p className="text-orange-400/70 text-xs mt-1">
              Gerçek bir Firebase projesi bağlanana kadar uygulama çalışmayacaktır.
              <br />
              <code className="bg-white/10 px-1 rounded">src/firebase.ts</code>{" "}
              dosyasını kendi Firebase bilgilerinizle güncelleyin.
            </p>
          </div>
        </div>

        {/* Adımlar */}
        <div className="space-y-6">
          {/* Adım 1 */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                1
              </span>
              <h2 className="font-semibold text-white">Firebase Projesi Oluştur</h2>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              Firebase Console'a gidin ve yeni bir proje oluşturun.
            </p>
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-sm px-4 py-2 rounded-xl transition"
            >
              <ExternalLink className="w-4 h-4" />
              Firebase Console'u Aç
            </a>
          </div>

          {/* Adım 2 */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                2
              </span>
              <h2 className="font-semibold text-white">
                Authentication → Google'ı Etkinleştir
              </h2>
            </div>
            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
              <li>Firebase Console → Authentication → Sign-in method</li>
              <li>Google provider'ı etkinleştirin</li>
              <li>Projenizin domain'ini authorized domains'e ekleyin</li>
            </ul>
          </div>

          {/* Adım 3 */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                3
              </span>
              <h2 className="font-semibold text-white">Firestore Database Oluştur</h2>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              Firestore → Create Database → Production mode seçin ve şu güvenlik kurallarını uygulayın:
            </p>
            <div className="relative">
              <pre className="bg-slate-800 border border-white/10 rounded-xl p-4 text-xs text-emerald-300 overflow-x-auto">
                {firestoreRules}
              </pre>
              <button
                onClick={() => handleCopy(firestoreRules)}
                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white p-1.5 rounded-lg transition"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Adım 4 */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                4
              </span>
              <h2 className="font-semibold text-white">
                src/firebase.ts Dosyasını Güncelle
              </h2>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              Firebase Console → Project Settings → Your apps → Web app'den config'i kopyalayın ve aşağıdaki şablona göre doldurun:
            </p>
            <div className="relative">
              <pre className="bg-slate-800 border border-white/10 rounded-xl p-4 text-xs text-sky-300 overflow-x-auto">
                {configTemplate}
              </pre>
              <button
                onClick={() => handleCopy(configTemplate)}
                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white p-1.5 rounded-lg transition"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Adım 5 */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                5
              </span>
              <h2 className="font-semibold text-white">Yeniden Derleyin ve Deploy Edin</h2>
            </div>
            <pre className="bg-slate-800 border border-white/10 rounded-xl p-4 text-xs text-yellow-300">
              npm run build
            </pre>
            <p className="text-xs text-slate-500 mt-2">
              Firebase Hosting, Netlify, Vercel veya istediğiniz herhangi bir statik host üzerinde yayınlayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
