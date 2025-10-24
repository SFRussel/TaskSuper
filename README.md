# TaskFlow - Minimal Task Management System

A beautiful, minimal task management system inspired by Trello with Firebase integration. Built with React, featuring drag-and-drop functionality, user authentication, and customizable profiles.

## ✨ Features

- **User Authentication**: Secure login and registration with Firebase Auth
- **Drag & Drop**: Intuitive task management with react-beautiful-dnd
- **Customizable UI**: Upload profile pictures and custom backgrounds
- **Real-time Updates**: Live sync across devices with Firebase Firestore
- **Notifications**: Email and deadline notifications
- **Minimal Design**: Clean, aesthetic interface focused on productivity
- **Responsive**: Works seamlessly on desktop and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   
   Update `src/services/firebase.js` with your Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Set up Firestore Security Rules**
   
   In Firebase Console > Firestore Database > Rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /boards/{boardId} {
         allow read, write: if request.auth != null;
       }
       match /tasks/{taskId} {
         allow read, write: if request.auth != null;
       }
       match /notifications/{notificationId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

5. **Set up Storage Security Rules**
   
   In Firebase Console > Storage > Rules:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /profilePictures/{userId} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       match /backgrounds/{userId} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
task-manager/
├── src/
│   ├── components/          # React components
│   │   ├── Login.js        # Login form
│   │   ├── Register.js     # Registration form
│   │   ├── Header.js       # App header with navigation
│   │   ├── TaskCard.js     # Individual task card
│   │   ├── TaskList.js     # List container for tasks
│   │   ├── TaskModal.js    # Modal for creating/editing tasks
│   │   └── Settings.js     # User settings and customization
│   ├── pages/              # Page components
│   │   ├── Auth.js         # Authentication page
│   │   └── Board.js        # Main board page
│   ├── services/           # Firebase and API services
│   │   ├── firebase.js     # Firebase configuration
│   │   ├── authService.js  # Authentication functions
│   │   ├── taskService.js  # Task CRUD operations
│   │   └── notificationService.js  # Notification handling
│   ├── contexts/           # React contexts
│   │   └── AuthContext.js  # Authentication state management
│   ├── App.js              # Main app component
│   ├── main.js             # Application entry point
│   └── styles.css          # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🎨 Customization

### Changing Theme Colors

Edit the CSS variables in `src/styles.css`:

```css
:root {
  --primary: #667eea;        /* Primary brand color */
  --primary-dark: #5568d3;   /* Primary hover state */
  --secondary: #764ba2;      /* Secondary brand color */
  /* ... more variables */
}
```

### Profile Customization

Users can customize their experience through the Settings modal:
- Upload profile picture
- Set custom background image
- Configure notification preferences

## 🔧 Git Workflow for Team Collaboration

### Branch Strategy

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Work on your changes
git add .
git commit -m "Add: your feature description"

# Push to your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

### File Ownership (Suggested)

To avoid merge conflicts, team members can focus on different areas:

- **Developer A**: Components (TaskCard, TaskList, TaskModal)
- **Developer B**: Services (authService, taskService)
- **Developer C**: Pages (Board, Auth) and Styling
- **Developer D**: Contexts and Firebase configuration

## 🔔 Setting Up Email Notifications

For production email notifications, you'll need to set up Firebase Cloud Functions:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Cloud Functions:
   ```bash
   firebase init functions
   ```

3. Create a function to send emails (example using Nodemailer):
   ```javascript
   // functions/index.js
   const functions = require('firebase-functions');
   const admin = require('firebase-admin');
   const nodemailer = require('nodemailer');
   
   admin.initializeApp();
   
   exports.sendEmailNotification = functions.firestore
     .document('emailQueue/{emailId}')
     .onCreate(async (snap, context) => {
       const emailData = snap.data();
       // Configure your email provider
       // Send email using nodemailer
     });
   ```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Build the project
npm run build

# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **Firebase** - Backend services
  - Authentication
  - Firestore (database)
  - Storage (file uploads)
  - Cloud Functions (notifications)
- **react-beautiful-dnd** - Drag and drop
- **lucide-react** - Icon library

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## 💡 Tips

- Use meaningful commit messages
- Test your changes before pushing
- Follow the existing code style
- Document new features
- Keep components small and reusable

## 🐛 Known Issues

- Drag and drop may have slight delays on mobile devices
- Email notifications require Cloud Functions setup

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Check existing issues for solutions
- Review Firebase documentation for backend-related questions

---

**Happy Task Managing! 🎉**
