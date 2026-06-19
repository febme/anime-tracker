# anime-tracker

A React + Firebase anime tracking app built with Vite.

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

## GitHub setup

Create the repo on GitHub: `https://github.com/febme/anime-tracker`

Push your local project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/febme/anime-tracker.git
git push -u origin main
```

## Vercel deployment

### 1. Connect GitHub

- Go to https://vercel.com
- Sign in or create an account
- Click **New Project**
- Select the `febme/anime-tracker` repository

### 2. Configure the project

- Build command: `npm run build`
- Output directory: `dist`

### 3. Add environment variables

In Vercel Project Settings → Environment Variables, add:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional:

- `VITE_ALLOWED_EMAILS` (comma-separated emails)
- `VITE_ADMIN_EMAILS` (comma-separated emails)

For full details, see `VERCEL_ENV.md`.

### 4. Deploy

After the environment variables are configured, trigger a deploy from Vercel.

Or use the CLI:

```bash
npx vercel login
npx vercel --prod
```

## Firebase setup

1. Enable Google Authentication in Firebase Console
2. Create Firestore database
3. Add Firestore rules from `FIRESTORE_RULES.md`

## Notes

- The app reads Firebase config from Vite env vars.
- The `vercel.json` file is already configured for deployment.
- If you get a sign-in issue, make sure your email is allowed or set `VITE_ALLOWED_EMAILS`.
