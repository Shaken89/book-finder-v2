# 🎓 End Term Project Defense Guide

## ⚡ Quick Start Checklist (Before Defense)

```bash
# 1. Start application
npm start

# 2. Open browser
http://localhost:4200/

# 3. Test main features:
✓ Search books (type "javascript")
✓ Add to favorites (click ☆)
✓ Login/Signup
✓ Check favorites persist after login
✓ Upload profile picture
✓ Test offline mode (Network tab → Offline)
```

---

## 📂 Key Files - Quick Access

### Authentication & Guards
- **Auth Service**: `src/app/services/auth.ts` (lines 1-50)
- **Auth Guard**: `src/app/guards/auth-guard.ts` (lines 1-20)
- **Login**: `src/app/components/login/login.ts`
- **Signup**: `src/app/components/signup/signup.ts` (lines 40-60 - password validation)

### Favorites Feature
- **Favorites Service**: `src/app/services/favorites.ts`
  - Lines 28-37: localStorage methods
  - Lines 40-55: Firestore methods
  - Lines 58-65: Merge local → Firestore on login
  - Lines 80-107: Add/Remove with immediate UI update
- **Item Card**: `src/app/components/item-card/item-card.ts` (lines 30-40 - toggle favorite)

### RxJS Implementation
- **Items List Search**: `src/app/components/items-list/items-list.ts`
  - Lines 45-50: `searchSubject` with `debounceTime(500)`, `distinctUntilChanged()`, `switchMap()`
- **Auth Service**: `src/app/services/auth.ts`
  - Line 15: `currentUser$` Observable
  - Lines 20-30: Auth state stream

### NgRx Store (Bonus)
- **Actions**: `src/app/items/state/items.actions.ts`
- **Reducer**: `src/app/items/state/items.reducer.ts` (lines 20-40)
- **Effects**: `src/app/items/state/items.effects.ts` (lines 15-30 - API calls)
- **Selectors**: `src/app/items/state/items.selectors.ts`

### PWA & Service Worker
- **Config**: `ngsw-config.json` (lines 10-30 - caching strategy)
- **App Config**: `src/app/app.config.ts` (line 30 - provideServiceWorker)

### Profile Picture (Base64 in Firestore)
- **Profile Component**: `src/app/components/profile/profile.ts`
  - Lines 82-145: Image compression (Canvas API)
  - Lines 147-172: Save to Firestore as base64 Data URL

---

## 🎤 Defense Questions & Answers

### 1. Favorites + Authentication

**Q: How do favorites work for non-logged-in users?**
```typescript
// src/app/services/favorites.ts:28-37
- Stored in localStorage as JSON array of book IDs
- Key: 'book-favorites'
- Persists after page reload
- Methods: loadFromLocalStorage(), saveToLocalStorage()
```

**Q: How do favorites work for logged-in users?**
```typescript
// src/app/services/favorites.ts:40-78
- Stored in Firestore: users/{uid}/favorites (array field)
- Real-time sync with BehaviorSubject
- Methods: loadFromFirestore(), saveToFirestore()
```

**Q: What happens to local favorites when user logs in?**
```typescript
// src/app/services/favorites.ts:58-65 (mergeLocalFavorites)
1. Read local favorites from localStorage
2. Merge with Firestore favorites (remove duplicates with Set)
3. Save merged array to Firestore
4. Clear localStorage
```

**Q: How does authentication guard work?**
```typescript
// src/app/guards/auth-guard.ts:10-20
- Uses AuthService.currentUser$ Observable
- Returns true if user exists, false if not
- Redirects to /login if not authenticated
- Applied to /profile route
```

### 2. Data Storage

**Q: Where is data stored?**
```
Firebase Firestore (FREE tier):
├── users/{uid}
│   ├── favorites: string[]           // Book IDs
│   └── profilePictureDataUrl: string // Base64 image

localStorage (guests):
└── book-favorites: string[]          // Book IDs JSON
```

**Q: Why not Firebase Storage for profile pictures?**
```
Storage is PAID. Instead:
- Compress image to 400x400px, 70% quality (~30-100KB)
- Convert to base64 Data URL
- Store as string field in Firestore document
- Firestore limit: 1MB per document (we use <100KB)
```

### 3. RxJS Operators

**Q: Which RxJS operators are used for search?**
```typescript
// src/app/components/items-list/items-list.ts:45-50

this.searchSubject.pipe(
  debounceTime(500),        // Wait 500ms after last keystroke
  distinctUntilChanged(),   // Only if value changed
  switchMap(query =>        // Cancel previous request
    this.store.select(selectAllItems)
  )
).subscribe();
```

**Q: Why use switchMap?**
```
- Cancels previous API request when new search starts
- Prevents race conditions
- Ensures only latest search results are shown
- Better UX: no stale data
```

**Q: How is authentication state managed?**
```typescript
// src/app/services/auth.ts:15
currentUser$ = user(this.auth); // Firebase Auth Observable

// Components subscribe:
this.authService.currentUser$.subscribe(user => {
  this.user = user; // Auto-updates on login/logout
});
```

### 4. Technical Questions

**Q: How does pagination work?**
```typescript
// src/app/components/items-list/items-list.ts
- Query params: ?page=0&limit=10
- Navigate with: router.navigate(['/items'], { queryParams })
- Effects listen to route params change
- Trigger new API call with startIndex = page * limit
```

**Q: What TypeScript interfaces are used?**
```typescript
// src/app/models/book.model.ts
export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    // ... 7+ fields
  };
}
```

**Q: How does PWA offline detection work?**
```typescript
// Listen to browser events
fromEvent(window, 'online')
fromEvent(window, 'offline')

// Show banner
isOnline$ = merge(
  fromEvent(window, 'online').pipe(map(() => true)),
  fromEvent(window, 'offline').pipe(map(() => false))
);
```

### 5. NgRx Store (Bonus)

**Q: Why use NgRx?**
```
✓ Centralized state management
✓ Predictable state changes (actions → reducer)
✓ Side effects handled in Effects (API calls)
✓ Time-travel debugging with DevTools
✓ Better for large apps
```

**Q: Explain NgRx flow:**
```
Component → dispatch(action)
  ↓
Effects → intercepts action → calls API
  ↓
API returns data
  ↓
Effects → dispatch(success action with data)
  ↓
Reducer → updates state
  ↓
Selectors → component gets updated data
```

**Q: Show me the reducer:**
```typescript
// src/app/items/state/items.reducer.ts
export const itemsReducer = createReducer(
  initialState,
  on(ItemsActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    isLoading: false
  }))
);
```

---

## 🎬 Demo Flow (3 minutes)

### Minute 1: Core Features
```
1. Show running app at localhost:4200
2. Search "Angular" → show debounce (wait 500ms)
3. Change items per page → pagination works
4. Click book → details page with 7+ fields
```

### Minute 2: Favorites + Auth
```
5. Click ☆ on book (guest) → becomes ★
6. Refresh page → favorite persists (localStorage)
7. Click Signup → create account
8. Login → favorites merged from localStorage
9. Add another favorite → saved to Firestore
```

### Minute 3: Bonus Features
```
10. Open DevTools → NgRx Store visible
11. Network tab → Offline → show offline banner
12. Profile → upload photo → compresses & saves
13. Navbar → profile picture appears
```

---

## 🐛 Troubleshooting

### Application won't start
```bash
npm install
npm start
```

### Firebase not configured
- Check `src/environments/environment.ts`
- Ensure Firestore & Auth enabled in Firebase Console

### Profile picture not loading
- Check console for errors
- Verify Firestore document: users/{uid}/profilePictureDataUrl exists

---

## 📊 Project Score Breakdown

| Feature | Points | Status |
|---------|--------|--------|
| Authentication | 1 | ✅ |
| API & Models | 1 | ✅ |
| Search & Pagination | 1 | ✅ |
| Routing (7+ pages) | 0.5 | ✅ (8 pages) |
| PWA & Service Worker | 0.5 | ✅ |
| Favorites | 1 | ✅ |
| Profile Picture | 1 | ✅ (base64 in Firestore) |
| **TOTAL BASE** | **6** | ✅ |
| **NgRx Store** | +0.5 | ✅ |
| **Offline Page** | +0.5 | ✅ |
| **Responsive CSS** | +0.5 | ✅ |
| **BONUS TOTAL** | **+1.5** | ✅ |
| **FINAL SCORE** | **7.5/6** | 🎯 |

---

## 💡 Pro Tips

1. **Open files before defense**: Have VS Code ready with key files open
2. **Know line numbers**: "The merge logic is on line 58"
3. **Show, don't tell**: Open browser DevTools to show Network, Store, localStorage
4. **Explain trade-offs**: "We use base64 instead of Storage because Storage is paid"
5. **Be honest**: If you don't know, say "I need to check that" - better than guessing

---

## 🚀 Final Checklist

- [ ] Application running on port 4200
- [ ] Can login with test account
- [ ] Favorites work (guest + logged in)
- [ ] Search with debounce works
- [ ] Profile picture uploads
- [ ] No console errors
- [ ] VS Code open with key files
- [ ] Browser DevTools ready (Network, Application tabs)

**Good luck! 🍀**
