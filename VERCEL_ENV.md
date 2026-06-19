Vercel environment variables

Set the following Environment Variables in your Vercel project (Project Settings → Environment Variables):

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

Optional lists (comma-separated, lowercase):
- VITE_ALLOWED_EMAILS        e.g. you@example.com,member@example.com
- VITE_ADMIN_EMAILS          e.g. admin@example.com

Build settings for Vercel:
- Framework: Other
- Build command: `npm run build`
- Output directory: `dist`

Quick deploy (if using Vercel CLI):

```bash
npm install
npx vercel login
npx vercel --prod
```

After deploy, confirm authentication works and update Firestore rules as described in FIRESTORE_RULES.md.
