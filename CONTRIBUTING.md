# Contributing to Smart City Reporter

Thank you for your interest in contributing to Smart City Reporter! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-city-reporter.git
   cd smart-city-reporter
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Follow the code style guidelines below
   - Write clear, concise commit messages
   - Test your changes thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes in detail

## 📝 Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused (Single Responsibility Principle)

### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach
- Use consistent spacing (4px base grid)
- Prefer semantic color names (e.g., `bg-neon-blue` instead of `bg-blue-500`)

### File Naming
- Components: PascalCase (e.g., `IssueCard.jsx`)
- Utilities: camelCase (e.g., `formatDate.js`)
- Hooks: camelCase with `use` prefix (e.g., `useIssues.js`)

## 🧪 Testing

Before submitting a PR:
1. Run the development server and test all features
2. Build the project to ensure no build errors
3. Test on different screen sizes
4. Check browser console for errors

```bash
npm run dev    # Test in development
npm run build  # Test production build
```

## 🐛 Reporting Bugs

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

## 💡 Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Provide clear use cases
- Explain why this feature would be useful
- Consider implementation complexity

## 📋 Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

Examples:
```
feat: add issue filtering by status
fix: resolve map loading issue on mobile
docs: update installation instructions
```

## 🏗️ Project Architecture

### Component Structure
```
src/components/
├── dashboard/      # Admin dashboard components
├── landing/        # Public landing page
├── report/         # Issue reporting flow
├── ui/            # Reusable UI components
└── layout/        # Layout components
```

### State Management
- React hooks for local state
- Firebase Firestore for global state
- Real-time subscriptions for live updates

### Styling
- Tailwind CSS for utility-first styling
- Custom theme with cyberpunk aesthetic
- Responsive design patterns

## 🔧 Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

### Useful Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
firebase emulators:start  # Test Firebase locally
```

## ❓ Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.
