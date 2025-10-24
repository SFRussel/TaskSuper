# Firebase Setup Guide

Complete guide to setting up Firebase for TaskFlow.

## 📋 Prerequisites

- Google account
- Node.js installed
- Project cloned locally

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `taskflow-app` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## 🔑 Step 2: Get Configuration Keys

1. In Firebase Console, click the ⚙️ gear icon → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register app with nickname: "TaskFlow Web"
5. Copy the configuration object

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "taskflow-app.firebaseapp.com",
  projectId: "taskflow-app",
  storageBucket: "taskflow-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

6. Update `src/services/firebase.js` with your config

## 🔐 Step 3: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
   - Toggle "Email/Password" to enabled
   - Leave "Email link" disabled
5. Click "Save"

### Optional: Add Authorized Domains
If deploying to custom domain:
1. Go to "Settings" tab in Authentication
2. Add your domain to "Authorized domains"

## 💾 Step 4: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (we'll add security rules later)
4. Choose a location closest to your users
5. Click "Enable"

### Add Security Rules

1. Go to "Rules" tab in Firestore
2. Replace with the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Boards collection
    match /boards/{boardId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              resource.data.userId == request.auth.uid;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
    
    // Email queue (for Cloud Functions)
    match /emailQueue/{emailId} {
      allow create: if request.auth != null;
      allow read, update, delete: if false; // Only Cloud Functions
    }
  }
}
```

3. Click "Publish"

### Create Indexes (Optional, for better performance)

1. Go to "Indexes" tab
2. Create composite index for tasks:
   - Collection: `tasks`
   - Fields: `boardId` (Ascending), `order` (Ascending)
   - Query scope: Collection

## 📦 Step 5: Set Up Cloud Storage

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Start in test mode
4. Choose same location as Firestore
5. Click "Done"

### Add Storage Security Rules

1. Go to "Rules" tab in Storage
2. Replace with the following rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Profile pictures
    match /profilePictures/{userId} {
      allow read: if true; // Anyone can view profile pictures
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024 && // 5MB limit
                      request.resource.contentType.matches('image/.*');
    }
    
    // Background images
    match /backgrounds/{userId} {
      allow read: if true; // Anyone can view backgrounds
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 10 * 1024 * 1024 && // 10MB limit
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Click "Publish"

## 📧 Step 6: Set Up Email Notifications (Optional)

### Using Firebase Extensions

1. Go to "Extensions" in Firebase Console
2. Install "Trigger Email" extension
3. Configure SMTP settings or use third-party service

### Using Cloud Functions (Advanced)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Cloud Functions:
```bash
firebase init functions
```

4. Install nodemailer:
```bash
cd functions
npm install nodemailer
```

5. Create email function in `functions/index.js`:
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password' // Use App Password for Gmail
  }
});

// Send email when document added to emailQueue
exports.sendEmailNotification = functions.firestore
  .document('emailQueue/{emailId}')
  .onCreate(async (snap, context) => {
    const emailData = snap.data();
    
    // Get user email
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(emailData.userId)
      .get();
    
    const userEmail = userDoc.data().email;
    
    const mailOptions = {
      from: 'TaskFlow <your-email@gmail.com>',
      to: userEmail,
      subject: emailData.subject,
      html: emailData.message
    };
    
    try {
      await transporter.sendMail(mailOptions);
      await snap.ref.update({ sent: true });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      await snap.ref.update({ error: error.message });
    }
  });

// Check for upcoming deadlines daily
exports.checkDeadlines = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const tasksSnapshot = await admin.firestore()
      .collection('tasks')
      .where('dueDate', '>=', now.toISOString())
      .where('dueDate', '<=', tomorrow.toISOString())
      .get();
    
    const notifications = [];
    tasksSnapshot.forEach(doc => {
      const task = doc.data();
      notifications.push({
        userId: task.userId,
        subject: 'Task Deadline Reminder',
        message: `Your task "${task.title}" is due tomorrow!`
      });
    });
    
    // Create email queue entries
    const batch = admin.firestore().batch();
    notifications.forEach(notif => {
      const ref = admin.firestore().collection('emailQueue').doc();
      batch.set(ref, notif);
    });
    
    await batch.commit();
    console.log(`Created ${notifications.length} deadline notifications`);
  });
```

6. Deploy functions:
```bash
firebase deploy --only functions
```

## 🧪 Step 7: Test Configuration

1. Start your development server:
```bash
npm run dev
```

2. Test authentication:
   - Register a new account
   - Check Firebase Console → Authentication → Users
   - Verify user appears in list

3. Test Firestore:
   - Create a task
   - Check Firebase Console → Firestore Database
   - Verify documents are created

4. Test Storage:
   - Upload profile picture
   - Check Firebase Console → Storage
   - Verify file appears in profilePictures folder

## 🚀 Step 8: Production Setup

### Update Security Rules

Before deploying to production, ensure security rules are properly configured (completed in steps above).

### Enable App Check (Recommended)

1. Go to "App Check" in Firebase Console
2. Click "Get started"
3. Register your app
4. Choose reCAPTCHA v3 for web
5. Enable enforcement for:
   - Firestore
   - Storage
   - Authentication

### Set Up Monitoring

1. Go to "Performance" in Firebase Console
2. Click "Get started"
3. Add SDK to your app (optional)

### Configure Quotas

1. Go to "Usage and billing"
2. Set up billing account (required for Cloud Functions)
3. Set up budget alerts

## 🔒 Security Best Practices

### Environment Variables

Never commit Firebase config to public repos. Use environment variables:

1. Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

3. Add `.env` to `.gitignore`

### API Key Restrictions

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Edit your API key
5. Set application restrictions (HTTP referrers)
6. Add your domain(s)

## 📊 Monitoring and Analytics

### Enable Google Analytics (Optional)

1. Go to "Analytics" in Firebase Console
2. Click "Enable Analytics"
3. Link to existing Google Analytics account or create new

### Check Usage

Regularly monitor:
- Authentication sign-ins
- Firestore reads/writes
- Storage downloads
- Functions invocations

Go to "Usage and billing" to track all metrics.

## 🐛 Troubleshooting

### Common Issues

**Error: "Permission denied"**
- Check Firestore/Storage security rules
- Verify user is authenticated
- Ensure user ID matches resource owner

**Error: "Firebase not initialized"**
- Check firebase.js configuration
- Verify all config values are correct
- Ensure Firebase SDK is imported

**Email notifications not working**
- Check Cloud Functions logs
- Verify SMTP credentials
- Check emailQueue documents

**Images not uploading**
- Check file size limits in Storage rules
- Verify file type is image/*
- Check user authentication

### Debug Mode

Enable Firebase debug mode in browser console:
```javascript
localStorage.setItem('debug', 'firestore:*');
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Samples](https://github.com/firebase/functions-samples)
- [Firebase Extensions](https://extensions.dev/)

## ✅ Checklist

Before going to production:
- [ ] Firebase project created
- [ ] Configuration added to app
- [ ] Authentication enabled and tested
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Storage enabled
- [ ] Storage rules configured
- [ ] Cloud Functions deployed (if using)
- [ ] Environment variables set up
- [ ] API key restrictions added
- [ ] Budget alerts configured
- [ ] App Check enabled (recommended)
- [ ] Monitoring set up

---

You're all set! 🎉 Your Firebase backend is ready for TaskFlow.
