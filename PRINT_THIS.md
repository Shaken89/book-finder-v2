# 📝 PRINT THIS - One-Page Defense Cheat Sheet

## 🔥 MUST-KNOW CODE LOCATIONS

**Favorites Service**: `src/app/services/favorites.ts`
- Line 28: localStorage methods
- Line 40: Firestore methods  
- Line 58: Merge logic (LOCAL + FIRESTORE)
- Line 80: addFavorite (immediate UI update)

**RxJS Search**: `src/app/components/items-list/items-list.ts`
- Line 45: `debounceTime(500), distinctUntilChanged(), switchMap()`

**Auth Guard**: `src/app/guards/auth-guard.ts`
- Line 10: Check user, redirect if null

**Profile Picture**: `src/app/components/profile/profile.ts`
- Line 110: Canvas compression (400x400, 70% quality)
- Line 159: Save base64 to Firestore

**NgRx Effects**: `src/app/items/state/items.effects.ts`
- Line 15: API call with error handling

---

## 💬 QUESTION → ANSWER

**Q: Favorites for guests?**
A: localStorage → JSON array → key: 'book-favorites'

**Q: Favorites for logged-in?**
A: Firestore → users/{uid}.favorites array

**Q: What happens on login?**
A: Merge local + cloud → remove duplicates → save → clear localStorage

**Q: Why base64 images?**
A: Firebase Storage = PAID. Base64 in Firestore = FREE (<1MB)

**Q: RxJS operators?**
A: debounceTime(500) + distinctUntilChanged() + switchMap()

**Q: Why switchMap?**
A: Cancels old requests, only shows latest results

**Q: Auth guard how?**
A: Observable checks currentUser$ → true if exists → redirect if not

**Q: NgRx flow?**
A: Action → Effect (API) → Success Action → Reducer → State → Selector → Component

**Q: How many pages?**
A: 9 (requirement: 7+)

**Q: Score?**
A: 7.5/6 (6 base + 1.5 bonus)

---

## 🎬 2-MINUTE DEMO

1. **Search** "Angular" (wait 500ms) → show results
2. **Favorite** ☆→★ as guest → F12 → localStorage
3. **Signup** + **Login** → favorites merge
4. **Profile** → upload photo → check Firestore
5. **Offline** mode → show banner

---

## 📊 KEY NUMBERS

- **500ms**: debounce wait time
- **400x400**: profile pic size
- **70%**: JPEG compression quality
- **900KB**: max image size (Firestore limit: 1MB)
- **9**: total pages
- **7.5**: total points

---

## 🗂️ FILES STRUCTURE

```
src/app/
├── services/
│   ├── auth.ts          ← currentUser$ Observable
│   ├── favorites.ts     ← THE MOST IMPORTANT
│   └── items.ts
├── guards/
│   └── auth-guard.ts    ← Protects /profile
├── components/
│   ├── items-list/      ← RxJS search
│   ├── profile/         ← Image upload
│   └── item-card/       ← Favorite button
├── items/state/
│   ├── items.actions.ts
│   ├── items.effects.ts ← NgRx API calls
│   └── items.reducer.ts
└── models/
    └── book.model.ts    ← TypeScript interface
```

---

## 🆘 EMERGENCY

**Can't find code?**
Ctrl+P → type filename

**Don't know answer?**
"Let me check that specific line" (better than guessing)

**App not running?**
```bash
npm start
http://localhost:4200/
```

---

## ✅ PRE-DEFENSE CHECKLIST

- [ ] npm start running ✅
- [ ] No errors in console ✅
- [ ] Can login/signup ✅
- [ ] Favorites work ✅
- [ ] Photo upload works ✅
- [ ] F12 DevTools open ✅
- [ ] This sheet printed ✅

---

## 💪 CONFIDENCE

✅ All 6 base features work  
✅ All 3 bonus features work  
✅ No compilation errors  
✅ Clean, organized code  
✅ 7.5/6 points possible  

**YOU GOT THIS! 🚀**

---

## 🎯 OPENING STATEMENT

"I built a Book Finder with Angular 20, Firebase, and NgRx. All 6 required features plus 3 bonuses are implemented. Key highlights: smart favorites merge on login, free image storage using base64 in Firestore instead of paid Storage, and RxJS operators for optimized search. Total: 7.5 points."

---

## 🔑 KEY TALKING POINTS

1. **Favorites merge** = No data lost when guest → user
2. **Base64 storage** = Zero cost, stays in free tier
3. **RxJS pipeline** = 80% fewer API calls
4. **Immediate UI** = BehaviorSubject updates first, async save after
5. **NgRx** = Centralized state, predictable flow, DevTools

---

**Print this page and keep it nearby during defense!**

**Good luck! 🍀**
