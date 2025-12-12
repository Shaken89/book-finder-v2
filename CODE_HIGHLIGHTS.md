# 🎯 Code Highlights - Must Know

## 1. Favorites Service - The Heart of the App

### localStorage (Guest Users)
```typescript
// src/app/services/favorites.ts:28-37

private loadFromLocalStorage(): void {
  const stored = localStorage.getItem('book-favorites');
  const favorites = stored ? JSON.parse(stored) : [];
  this.favoritesSubject.next(favorites);
}

private saveToLocalStorage(favorites: string[]): void {
  localStorage.setItem('book-favorites', JSON.stringify(favorites));
  this.favoritesSubject.next(favorites);
}
```
**Defense answer**: "We store favorites as a JSON array in localStorage using the key 'book-favorites'. This persists after page reload for guest users."

---

### Firestore (Logged-in Users)
```typescript
// src/app/services/favorites.ts:40-55

private loadFromFirestore(uid: string): void {
  const docRef = doc(this.firestore, 'users', uid);
  from(getDoc(docRef)).pipe(
    map(docSnap => docSnap.exists() ? docSnap.data()['favorites'] : []),
    catchError(() => of([]))
  ).subscribe(favorites => {
    this.favoritesSubject.next(favorites);
    this.mergeLocalFavorites(uid); // Merge if any local favorites exist
  });
}
```
**Defense answer**: "For logged-in users, we store favorites in Firestore under users/{uid} document, in a field called 'favorites' which is an array of book IDs."

---

### The Magic: Merge on Login
```typescript
// src/app/services/favorites.ts:58-65

private mergeLocalFavorites(uid: string): void {
  const localFavorites = this.getLocalFavorites();
  if (localFavorites.length > 0) {
    const current = this.favoritesSubject.value;
    const merged = [...new Set([...current, ...localFavorites])]; // Remove duplicates
    this.saveToFirestore(uid, merged);
    localStorage.removeItem('book-favorites'); // Clean up
  }
}
```
**Defense answer**: "When a user logs in, we check if they have any local favorites. If yes, we merge them with their Firestore favorites using a Set to remove duplicates, save to Firestore, then clear localStorage."

---

### Immediate UI Update
```typescript
// src/app/services/favorites.ts:80-107

addFavorite(bookId: string): void {
  const current = this.favoritesSubject.value;
  if (current.includes(bookId)) return;
  
  const updated = [...current, bookId];
  // ⚡ UPDATE STATE FIRST for instant UI response
  this.favoritesSubject.next(updated);
  
  // Then save to backend asynchronously
  user(this.auth).pipe(
    switchMap(currentUser => {
      if (currentUser) {
        const docRef = doc(this.firestore, 'users', currentUser.uid);
        return from(setDoc(docRef, { favorites: updated }, { merge: true }));
      } else {
        localStorage.setItem('book-favorites', JSON.stringify(updated));
        return of(void 0);
      }
    })
  ).subscribe();
}
```
**Defense answer**: "We update the BehaviorSubject immediately so the UI responds instantly (☆→★), then save to Firestore/localStorage asynchronously in the background. This prevents UI lag."

---

## 2. RxJS Search Implementation

```typescript
// src/app/components/items-list/items-list.ts:45-65

private searchSubject = new Subject<string>();

ngOnInit(): void {
  // Set up reactive search pipeline
  this.searchSubject.pipe(
    debounceTime(500),        // Wait 500ms after user stops typing
    distinctUntilChanged(),   // Only proceed if value actually changed
    switchMap(query => {      // Cancel previous request, take latest
      this.store.dispatch(ItemsActions.loadItems({ 
        query, 
        page: 0, 
        limit: this.itemsPerPage 
      }));
      return this.store.select(selectAllItems);
    })
  ).subscribe();
}

onSearchInput(): void {
  this.searchSubject.next(this.searchQuery); // Push to stream
}
```

**Defense answer**: "When user types in search box, we push the value to a Subject. The pipeline waits 500ms (debounceTime) to avoid excessive API calls, checks if the value changed (distinctUntilChanged), then cancels any pending request and starts a new one (switchMap). This optimizes network usage and ensures only the latest search results are shown."

---

## 3. Auth Guard

```typescript
// src/app/guards/auth-guard.ts:10-20

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (user) {
        return true; // User is authenticated
      } else {
        router.navigate(['/login']); // Redirect to login
        return false;
      }
    })
  );
};
```

**Defense answer**: "The auth guard checks the currentUser$ Observable from AuthService. If a user exists, it returns true and allows access. If null, it redirects to the login page and returns false. This protects the /profile route."

---

## 4. Profile Picture: Base64 in Firestore

### Compression
```typescript
// src/app/components/profile/profile.ts:110-145

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Resize to max 400x400px, maintaining aspect ratio
let width = img.width;
let height = img.height;
const maxSize = 400;

if (width > height) {
  if (width > maxSize) {
    height = (height * maxSize) / width;
    width = maxSize;
  }
} else {
  if (height > maxSize) {
    width = (width * maxSize) / height;
    height = maxSize;
  }
}

canvas.width = width;
canvas.height = height;
ctx.drawImage(img, 0, 0, width, height);

// Convert to base64 Data URL
const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality

// Validate size (Firestore 1MB limit)
const sizeInKB = Math.round((dataUrl.length * 3) / 4 / 1024);
if (sizeInKB > 900) {
  this.uploadError = 'Image too large after compression';
  return;
}
```

**Defense answer**: "We use Canvas API to resize the image to max 400x400 pixels, maintaining aspect ratio. Then convert to JPEG at 70% quality using toDataURL(), which gives us a base64 string. We validate it's under 900KB to respect Firestore's 1MB document limit. This way we don't need Firebase Storage which is a paid feature."

---

### Save to Firestore
```typescript
// src/app/components/profile/profile.ts:159-172

private saveToFirestore(dataUrl: string): void {
  const userDocRef = doc(this.firestore, 'users', this.user.uid);
  
  from(setDoc(userDocRef, { profilePictureDataUrl: dataUrl }, { merge: true }))
    .pipe(catchError(error => { /* handle error */ }))
    .subscribe(() => {
      this.profilePictureDataUrl = dataUrl;
      this.uploadSuccess = true;
    });
}
```

**Defense answer**: "We save the base64 Data URL as a simple string field in the Firestore users/{uid} document. The 'merge: true' option ensures we don't overwrite other user data like favorites."

---

## 5. NgRx Flow (Bonus)

### Action
```typescript
// src/app/items/state/items.actions.ts

export const loadItems = createAction(
  '[Items List] Load Items',
  props<{ query: string; page: number; limit: number }>()
);
```

### Effect (API Call)
```typescript
// src/app/items/state/items.effects.ts:15-30

loadItems$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ItemsActions.loadItems),
    switchMap(action =>
      this.itemsService.searchBooks(action.query, action.page, action.limit).pipe(
        map(response => ItemsActions.loadItemsSuccess({ items: response.items })),
        catchError(error => of(ItemsActions.loadItemsFailure({ error })))
      )
    )
  )
);
```

### Reducer (State Update)
```typescript
// src/app/items/state/items.reducer.ts:20-40

export const itemsReducer = createReducer(
  initialState,
  on(ItemsActions.loadItems, state => ({
    ...state,
    isLoading: true
  })),
  on(ItemsActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    isLoading: false
  }))
);
```

**Defense answer**: "Component dispatches 'loadItems' action. Effect intercepts it, calls the API using ItemsService, then dispatches 'loadItemsSuccess' with the data. Reducer listens for this success action and updates the state. Component subscribes to selector and gets the updated items automatically. This creates a unidirectional data flow that's predictable and debuggable."

---

## 6. TypeScript Interfaces

```typescript
// src/app/models/book.model.ts:1-20

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    categories?: string[];
    pageCount?: number;
    language?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}
```

**Defense answer**: "We have a Book interface that matches the Google Books API response structure. The volumeInfo object contains all the book details. We use optional properties (?) for fields that might not exist in every book. This provides type safety and IDE autocomplete."

---

## Quick Fire Answers

**Q: How many pages?**
A: 9 total (8 main + 1 offline bonus page)

**Q: What's in localStorage?**
A: Guest favorites as JSON array under 'book-favorites' key

**Q: What's in Firestore?**
A: users/{uid} document with 'favorites' array and 'profilePictureDataUrl' string

**Q: Why debounceTime 500ms?**
A: Balance between responsiveness and reducing API calls. User pauses typing after ~300-500ms.

**Q: Why switchMap not mergeMap?**
A: switchMap cancels previous request. If user types fast, we only want the latest search result, not all intermediate results.

**Q: How does image compression work?**
A: Canvas API resizes to 400x400, draws image, converts to JPEG base64 at 70% quality

**Q: Score?**
A: 6 base + 1.5 bonus = 7.5 points

---

## 🎯 You Got This!

All code is ready, all features work, all explanations prepared.

**Just be confident and show what you built!** 💪
