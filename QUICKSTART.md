# TaskFlow - Quick Start Guide

Get up and running with TaskFlow in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies (2 minutes)

```bash
cd task-manager
npm install
```

### 2. Configure Firebase (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Email/Password authentication
4. Create Firestore database (test mode)
5. Enable Storage
6. Copy your config from Project Settings

7. Update `src/services/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_NUMBER",
  appId: "YOUR_APP_ID"
};
```

### 3. Run the App (1 minute)

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## ✨ First Steps

1. **Register** - Create your account
2. **Create Tasks** - Click "Add Task" in any list
3. **Drag & Drop** - Move tasks between lists
4. **Customize** - Click your profile → Settings to upload images
5. **Organize** - Add task details, priorities, and due dates

## 📁 Project Structure Overview

```
src/
├── components/       # UI components (TaskCard, Header, etc.)
├── pages/           # Page components (Board, Auth)
├── services/        # Firebase integration
├── contexts/        # React contexts (AuthContext)
└── styles.css       # All styles
```

## 🎨 Key Features

- ✅ Drag and drop tasks between lists
- ✅ User authentication (register/login)
- ✅ Upload profile picture and background
- ✅ Set task priorities and due dates
- ✅ Real-time updates across devices
- ✅ Mobile responsive design

## 🔧 Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🌿 Git Workflow

```bash
# Start working on a feature
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "Add: my feature"

# Push to GitHub
git push origin feature/my-feature
```

## 🎯 Team Collaboration

### File Assignments (Avoid Conflicts)

**Components:**
- `TaskCard.js`, `TaskList.js` → Developer A
- `TaskModal.js`, `Header.js` → Developer B
- `Login.js`, `Register.js`, `Settings.js` → Developer C

**Services:**
- `authService.js`, `taskService.js` → Developer D
- `notificationService.js` → Developer A

**Pages:**
- `Board.js` → Developer B
- `Auth.js` → Developer C

**Styles:**
- `styles.css` → Developer C (coordinate changes)

### Best Practices

1. **Pull before starting**: `git pull origin develop`
2. **Create feature branches**: `git checkout -b feature/name`
3. **Commit often**: Save your progress regularly
4. **Test before pushing**: Run the app locally
5. **Write clear commits**: "Add: task priority colors"

## 📖 Need Help?

- **Full Documentation**: See `README.md`
- **Firebase Setup**: See `FIREBASE_SETUP.md`
- **Contributing Guide**: See `CONTRIBUTING.md`
- **Issues**: Create an issue on GitHub

## 🎉 You're Ready!

Start building amazing features! Remember:
- Keep commits small and focused
- Test your changes
- Communicate with your team
- Have fun coding! 🚀

---

**Happy Task Managing!**
