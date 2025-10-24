# Contributing to TaskFlow

Thank you for your interest in contributing to TaskFlow! This guide will help you get started with our team collaboration workflow.

## 🌳 Branch Strategy

We follow a feature branch workflow:

```
main (production-ready code)
  ↓
develop (integration branch)
  ↓
feature/your-feature (your work)
```

### Creating a Feature Branch

```bash
# Update your local repository
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/task-modal-improvements

# Or for bug fixes
git checkout -b fix/drag-drop-issue
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/notification-system`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)
- `style/` - UI/styling changes (e.g., `style/task-card-design`)
- `docs/` - Documentation (e.g., `docs/api-documentation`)

## 📝 Commit Messages

Use clear, descriptive commit messages following this format:

```
Type: Brief description

Detailed explanation (if needed)
```

### Commit Types

- `Add:` - New feature or file
- `Update:` - Modify existing functionality
- `Fix:` - Bug fix
- `Remove:` - Delete code or files
- `Refactor:` - Code restructuring
- `Style:` - Formatting, styling changes
- `Docs:` - Documentation changes
- `Test:` - Adding or updating tests

### Examples

```bash
git commit -m "Add: Drag and drop reordering for tasks"
git commit -m "Fix: Profile picture upload not working on Safari"
git commit -m "Update: Improve task card hover animations"
git commit -m "Refactor: Simplify authentication service logic"
```

## 🔄 Pull Request Process

1. **Before Starting Work**
   - Check existing issues and PRs to avoid duplicate work
   - Discuss major changes in an issue first
   - Assign yourself to the issue you're working on

2. **While Working**
   - Keep your branch up to date with develop
   - Make small, focused commits
   - Test your changes thoroughly

3. **Submitting a PR**
   ```bash
   # Push your branch
   git push origin feature/your-feature
   
   # Go to GitHub and create a Pull Request
   # Select: base: develop <- compare: feature/your-feature
   ```

4. **PR Description Template**
   ```markdown
   ## What does this PR do?
   Brief description of changes
   
   ## Type of change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Refactoring
   - [ ] Documentation
   
   ## Checklist
   - [ ] My code follows the project's style guidelines
   - [ ] I have tested my changes
   - [ ] I have updated the documentation (if needed)
   - [ ] No new warnings or errors introduced
   
   ## Screenshots (if applicable)
   [Add screenshots here]
   ```

5. **Code Review**
   - Wait for at least one team member to review
   - Address feedback and make requested changes
   - Once approved, merge using "Squash and merge"

## 🎯 File Ownership (To Reduce Conflicts)

### Components Directory
- **TaskCard.js** - Developer A
- **TaskList.js** - Developer A
- **TaskModal.js** - Developer B
- **Header.js** - Developer B
- **Settings.js** - Developer C
- **Login.js** - Developer C
- **Register.js** - Developer C

### Services Directory
- **authService.js** - Developer D
- **taskService.js** - Developer D
- **notificationService.js** - Developer A
- **firebase.js** - Team Lead (protected)

### Pages Directory
- **Board.js** - Developer B
- **Auth.js** - Developer C

### Styles
- **styles.css** - Developer C (coordinate changes)

## 🔧 Development Workflow

### 1. Pick an Issue
```bash
# Find an issue on GitHub Issues tab
# Comment "I'll work on this"
# Assign yourself to the issue
```

### 2. Create Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/issue-123-add-tags
```

### 3. Make Changes
```bash
# Write code
# Test locally
git add .
git commit -m "Add: Task tagging functionality"
```

### 4. Keep Updated
```bash
# Regularly sync with develop
git checkout develop
git pull origin develop
git checkout feature/issue-123-add-tags
git merge develop
# Resolve conflicts if any
```

### 5. Push and Create PR
```bash
git push origin feature/issue-123-add-tags
# Create PR on GitHub
```

## 🧪 Testing Guidelines

Before submitting a PR, test the following:

### Authentication Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout
- [ ] Error handling (wrong password, etc.)

### Task Management
- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Drag and drop between lists
- [ ] Task priority colors display correctly

### User Settings
- [ ] Upload profile picture
- [ ] Upload background image
- [ ] Toggle notifications
- [ ] Changes persist after refresh

### Responsive Design
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)

## 🚫 Merge Conflict Resolution

If you encounter merge conflicts:

```bash
# 1. Update your branch
git checkout develop
git pull origin develop
git checkout feature/your-feature
git merge develop

# 2. Resolve conflicts in your editor
# Look for markers: <<<<<<<, =======, >>>>>>>

# 3. After resolving
git add .
git commit -m "Merge: Resolve conflicts with develop"
git push origin feature/your-feature
```

### Common Conflict Areas
- **styles.css** - Coordinate CSS changes
- **firebase.js** - Don't modify without team discussion
- **package.json** - Communicate new dependencies

## 💬 Communication

### Before Making Changes
- Comment on the issue you're working on
- Discuss significant changes in team chat
- Ask questions if requirements are unclear

### During Development
- Push commits regularly (at least daily)
- Update issue with progress
- Ask for help if stuck for >2 hours

### After Completion
- Request review from specific team member
- Be responsive to feedback
- Help others review when tagged

## 📋 Code Style Guidelines

### React Components
```javascript
// Use functional components with hooks
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  
  // Event handlers
  const handleClick = () => {
    // logic
  };
  
  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### CSS
```css
/* Use kebab-case for class names */
.task-card {
  /* Properties in alphabetical order */
  background: var(--white);
  border-radius: var(--radius);
  padding: 16px;
}

/* Use CSS variables for colors */
color: var(--primary);
```

### File Naming
- Components: PascalCase (TaskCard.js)
- Services: camelCase (authService.js)
- CSS: kebab-case (task-card.css)

## 🎨 Adding New Features

### Process
1. Create an issue describing the feature
2. Get approval from team lead
3. Create feature branch
4. Implement with tests
5. Update documentation
6. Submit PR with screenshots
7. Address review feedback
8. Merge after approval

### Feature Checklist
- [ ] Code implemented
- [ ] Tested on multiple browsers
- [ ] Responsive design verified
- [ ] No console errors/warnings
- [ ] Updated README if needed
- [ ] Added comments for complex logic

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- Browser: [e.g., Chrome 120]
- Device: [e.g., iPhone 13]
- OS: [e.g., macOS 14]
```

## ⚡ Quick Tips

- **Pull before Push**: Always `git pull` before starting work
- **Small PRs**: Keep changes focused and reviewable
- **Test First**: Run the app before committing
- **Communicate**: Over-communication is better than under
- **Help Others**: Review PRs when you can
- **Stay Updated**: Check team chat daily

## 🚀 Release Process

1. Feature branches → `develop` (via PR)
2. Testing on `develop` branch
3. `develop` → `main` (release PR)
4. Tag release: `v1.0.0`
5. Deploy to production

## 📚 Resources

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Questions?

If you have questions:
1. Check this guide first
2. Ask in team chat
3. Create a discussion on GitHub
4. Contact team lead

---

**Thank you for contributing to TaskFlow! 🎉**
