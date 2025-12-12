# 📄 All Pages - Quick Links

## During Defense - Open These URLs

### 1. Home Page
```
http://localhost:4200/
```
Landing page with welcome message

### 2. About Page
```
http://localhost:4200/about
```
Project information

### 3. Books List (Items)
```
http://localhost:4200/items
```
- Search bar with debounce
- Pagination controls
- Book cards with ☆ favorite button

### 4. Book Details
```
http://localhost:4200/items/H9emM_qDPakC
```
Single book with 7+ fields (title, author, publisher, etc.)

### 5. Favorites Page
```
http://localhost:4200/favorites
```
Shows all favorited books

### 6. Login Page
```
http://localhost:4200/login
```
Firebase Authentication login

### 7. Signup Page
```
http://localhost:4200/signup
```
Registration with password validation

### 8. Profile Page (Protected)
```
http://localhost:4200/profile
```
- Requires authentication (authGuard)
- Shows user email, UID, metadata
- Profile picture upload

### 9. Offline Page (Bonus)
```
http://localhost:4200/offline
```
Shown when no internet connection

---

## Test Account (Create During Defense)

```
Email: test@defense.com
Password: Test123!
```

Or use your own Firebase account.

---

## Quick Demo Flow

```bash
# 1. Home
http://localhost:4200/

# 2. Books List + Search
http://localhost:4200/items?q=angular&page=0&limit=10

# 3. Add favorite (guest mode)
Click ☆ on any book

# 4. Check localStorage
F12 → Application → Local Storage → book-favorites

# 5. Signup
http://localhost:4200/signup

# 6. Login
http://localhost:4200/login

# 7. Favorites merged (check Firestore)
F12 → Console → should see merge logs

# 8. Profile
http://localhost:4200/profile

# 9. Upload photo
Choose image → compress → save

# 10. Check Firestore
Firebase Console → Firestore → users/{uid}
```

---

## Routes Configuration

See [app.routes.ts](src/app/app.routes.ts) for all route definitions:
- Lines 1-20: All route paths
- Line 15: authGuard on /profile
