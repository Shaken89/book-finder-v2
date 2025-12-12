# ✅ Pre-Defense Checklist

## 5 Minutes Before Defense

### 1. Application Status
- [ ] Terminal: `npm start` running successfully
- [ ] Browser: http://localhost:4200/ opens
- [ ] No compilation errors
- [ ] No console errors (F12)

### 2. Firebase Configuration
- [ ] Firebase project created: angular-app-deb38
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] No Firebase Storage needed ✓

### 3. Test All Features

#### Authentication
- [ ] Can signup with new account
- [ ] Email validation works (must be valid email)
- [ ] Password validation works (8+ chars, special, number)
- [ ] Can login
- [ ] Can logout
- [ ] Profile route protected (redirects to /login if not authenticated)

#### Favorites (Guest)
- [ ] Click ☆ → becomes ★
- [ ] Refresh page → favorite persists
- [ ] Check localStorage: `book-favorites` key exists
- [ ] Can remove favorite (★ → ☆)

#### Favorites (Logged In)
- [ ] Add favorite while logged in
- [ ] Check Firestore: users/{uid}.favorites exists
- [ ] Logout → Login → favorites still there
- [ ] **Merge test**: Add favorite as guest → login → check merged

#### Search & Pagination
- [ ] Type in search box → wait 500ms → request fires
- [ ] Search "javascript" → shows results
- [ ] Change items per page → works
- [ ] Click Next page → URL changes, new data loads
- [ ] Previous button disabled on page 0

#### Profile Picture
- [ ] Login → Profile page
- [ ] Upload JPG/PNG (< 5MB)
- [ ] See "Compressing and saving..." message
- [ ] See success message after upload
- [ ] Picture appears on profile page
- [ ] Picture appears in navbar
- [ ] Refresh page → picture still there
- [ ] Check Firestore: users/{uid}.profilePictureDataUrl exists

#### PWA & Offline
- [ ] F12 → Network tab → Throttling → Offline
- [ ] See offline banner appear
- [ ] Service worker registered (Application → Service Workers)
- [ ] App shell cached

#### Book Details
- [ ] Click any book → details page loads
- [ ] Shows 7+ fields: title, authors, publisher, date, categories, pages, language
- [ ] Back button works

### 4. Open Files in VS Code

Key files to have ready:
```
✓ DEFENSE_GUIDE.md (main guide)
✓ CHEAT_SHEET.md (quick reference)
✓ src/app/services/favorites.ts
✓ src/app/services/auth.ts
✓ src/app/components/items-list/items-list.ts
✓ src/app/components/profile/profile.ts
✓ src/app/guards/auth-guard.ts
✓ src/app/items/state/items.effects.ts
```

### 5. Browser DevTools Setup
- [ ] F12 opened
- [ ] Console tab clear (no errors)
- [ ] Network tab ready
- [ ] Application tab → Local Storage visible
- [ ] Application tab → Service Workers visible

### 6. Documentation
- [ ] PROJECT_SUMMARY.md reviewed
- [ ] DEFENSE_GUIDE.md printed or on second screen
- [ ] CHEAT_SHEET.md ready for quick reference

### 7. Know Your Numbers
- [ ] **Total pages**: 9 (8 main + 1 offline)
- [ ] **Base points**: 6/6
- [ ] **Bonus points**: +1.5 (NgRx, Offline, Responsive)
- [ ] **Total possible**: 7.5
- [ ] **Search debounce**: 500ms
- [ ] **Image compression**: 400x400px, 70% quality
- [ ] **Max image size**: <900KB after compression

---

## Common Issues & Fixes

### Issue: Favorites not persisting
**Check**: localStorage or Firestore?
- Guest: F12 → Application → Local Storage → `book-favorites`
- Logged: Firebase Console → Firestore → users/{uid}

### Issue: Profile picture not saving
**Check**: 
1. Console for errors
2. Is user authenticated?
3. Is image < 5MB before compression?
4. Is compressed size < 900KB?

### Issue: Search not working
**Check**:
1. Network tab → see API request after 500ms?
2. Console → NgRx Store actions firing?
3. Is Google Books API accessible?

### Issue: Auth guard not working
**Check**:
1. Try accessing /profile without login
2. Should redirect to /login
3. Console → see auth guard logs?

---

## Emergency Commands

```bash
# Restart dev server
Ctrl+C
npm start

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run build

# Test production build
npm run build
npx http-server dist/book-finder/browser
```

---

## Last-Minute Review

### Questions You Should Be Able to Answer:

1. **How do favorites work?**
   → localStorage (guest) + Firestore (user) + merge on login

2. **Why not Firebase Storage?**
   → It's paid. Use base64 in Firestore instead.

3. **What RxJS operators?**
   → debounceTime, distinctUntilChanged, switchMap

4. **How does auth guard work?**
   → Checks currentUser$, redirects if null

5. **Why use NgRx?**
   → Centralized state, predictable updates, DevTools

6. **Show me the merge logic**
   → favorites.ts line 58-65

---

## 🎯 Ready to Defend!

If all checkboxes are ✅, you're ready!

**Remember:**
- Stay calm
- Show code first, explain second
- Use console/DevTools to demonstrate
- It's okay to say "let me find that" and use Ctrl+P

**Good luck! 🍀**

**Your app is solid - 7.5/6 points! 🎯**
