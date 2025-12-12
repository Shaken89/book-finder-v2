# BookFinder - Angular End Term Project

A comprehensive Angular application demonstrating authentication, state management, PWA capabilities, and Firebase integration.

## 🎓 FOR DEFENSE

**Start here**: [CHEAT_SHEET.md](CHEAT_SHEET.md) - Quick 3-minute reference  
**Comprehensive guide**: [DEFENSE_GUIDE.md](DEFENSE_GUIDE.md) - All questions answered  
**Ready check**: [DEFENSE_READY.md](DEFENSE_READY.md) - Final status  

**Score**: 7.5/6 points (6 base + 1.5 bonus) 🎯

---

## 📋 Project Features

### Required Features (6 points)
- ✅ **Authentication** (1pt): Firebase Auth with password validation
- ✅ **API & Models** (1pt): Google Books API + TypeScript interfaces
- ✅ **Search & Pagination** (1pt): RxJS operators (debounceTime, distinctUntilChanged, switchMap)
- ✅ **Routing** (0.5pt): 9 pages with auth guard
- ✅ **PWA** (0.5pt): Service worker + offline detection
- ✅ **Favorites** (1pt): localStorage (guests) + Firestore (users) + merge on login
- ✅ **Profile Picture** (1pt): Base64 compression in Firestore (NO Firebase Storage - it's paid!)

### Bonus Features (+1.5 points)
- ✅ **NgRx Store** (+0.5): Actions, Effects, Reducers, Selectors
- ✅ **Offline Page** (+0.5): PWA offline detection
- ✅ **Responsive CSS** (+0.5): Mobile-friendly design

See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for complete implementation details.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI: `npm install -g @angular/cli`

### Installation

```bash
npm install
```

### Development server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
