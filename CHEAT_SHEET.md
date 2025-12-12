# 🎯 QUICK CHEAT SHEET - 3 Minutes Defense

## ⚡ START (10 seconds)
```
App running: http://localhost:4200/
Open DevTools: F12 (Network, Application, Console tabs)
VS Code: DEFENSE_GUIDE.md + key files open
```

---

## 📍 FAVORITES + AUTH (45 seconds)

### Show Code:
**favorites.ts** line 28: localStorage
**favorites.ts** line 40: Firestore  
**favorites.ts** line 58: merge logic

### Demo:
1. Guest: Click ☆ → check localStorage (F12 → Application → Local Storage)
2. Signup → Login
3. localStorage merged → check Firestore (Console → Firebase)

### Answer:
```
- Guests: localStorage JSON array
- Users: Firestore users/{uid}.favorites
- On login: merge + clear localStorage
- BehaviorSubject for reactive UI
- Immediate UI update, async backend
```

---

## 🗄️ DATA STORAGE (30 seconds)

### Show Code:
**profile.ts** line 82: compress image (Canvas)
**profile.ts** line 159: save base64 to Firestore

### Answer:
```
Firebase Storage = PAID ❌
Solution: Base64 Data URL in Firestore ✅
- Compress to 400x400px, 70% quality
- ~30-100KB base64 string
- Save as field in Firestore users/{uid}
- Under 1MB document limit
```

---

## 🔄 RxJS (45 seconds)

### Show Code:
**items-list.ts** line 45-50: search operators

```typescript
searchSubject.pipe(
  debounceTime(500),      // Wait after typing
  distinctUntilChanged(), // Only if changed
  switchMap(...)          // Cancel old request
)
```

### Demo:
1. Type in search → wait 500ms → request fires
2. Network tab → show canceled requests

### Answer:
```
debounceTime: Reduce API calls
distinctUntilChanged: Skip duplicates
switchMap: Cancel previous, take latest
```

---

## 🔧 TECHNICAL (45 seconds)

### Q: How pagination?
**items-list.ts** line 75: query params
```
?page=0&limit=10
Navigate with router.navigate(['/items'], { queryParams })
```

### Q: Show TypeScript interface?
**book.model.ts** line 1-20
```typescript
interface Book {
  id: string;
  volumeInfo: { title, authors, ... }
}
```

### Q: Auth guard?
**auth-guard.ts** line 10-20
```typescript
return currentUser$.pipe(map(user => !!user))
Redirect to /login if false
```

---

## 🎁 BONUS - NgRx (15 seconds)

### Show:
- DevTools → Redux tab
- **items.effects.ts** line 15: API call
- **items.reducer.ts** line 20: state update

### Answer:
```
Actions → Effects (API) → Actions → Reducer → State
Selectors: Components subscribe to slices
```

---

## 🎬 DEMO SEQUENCE (if asked)

1. **Search** "Angular" (show 500ms debounce)
2. **Add favorite** (☆→★) as guest
3. **Signup** + Login (merge happens)
4. **Upload photo** (compress + Firestore)
5. **Offline** mode (banner + service worker)
6. **DevTools**: localStorage, Firestore, NgRx Store

---

## 🆘 IF STUCK

**Can't find code?**
"It's in [file], let me search... *Ctrl+P to find file*"

**Don't know answer?**
"I'd need to check that specific implementation detail"

**Question unclear?**
"Could you clarify - are you asking about [X] or [Y]?"

---

## ✅ FINAL CHECK

Before defense:
- [ ] `npm start` running ✅
- [ ] Can login/signup ✅
- [ ] Favorites work ✅
- [ ] Search works ✅
- [ ] No errors in console ✅
- [ ] DEFENSE_GUIDE.md open ✅

---

**Score: 7.5/6 points (6 base + 1.5 bonus) 🎯**
