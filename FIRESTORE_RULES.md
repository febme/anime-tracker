Example Firestore security rules (update the email lists before deploying):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /series/{seriesId} {
      // Anyone can read the series list (adjust to `request.auth != null` to restrict reads)
      allow read: if true;

      // Create and update allowed only for approved emails
      allow create, update: if request.auth != null &&
        request.auth.token.email in [
          // replace with your allowed emails
          "you@example.com",
          "member@example.com"
        ];

      // Delete allowed only for admin emails
      allow delete: if request.auth != null &&
        request.auth.token.email in [
          // replace with your admin emails
          "admin@example.com"
        ];
    }
  }
}

How to deploy:
- Open Firebase console → Firestore → Rules, paste and publish.
- Alternatively use Firebase CLI:

  firebase deploy --only firestore:rules

Note: For larger teams, consider using Firebase Custom Claims to manage admin rights instead of hardcoding emails.
