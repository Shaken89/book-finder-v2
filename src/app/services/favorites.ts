import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  favorites$: Observable<string[]> = this.favoritesSubject.asObservable();

  private readonly STORAGE_KEY = 'book-favorites';

  constructor() {
    // Load favorites on init
    user(this.auth).subscribe(currentUser => {
      if (currentUser) {
        this.loadFromFirestore(currentUser.uid);
      } else {
        this.loadFromLocalStorage();
      }
    });
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const favorites = stored ? JSON.parse(stored) : [];
    this.favoritesSubject.next(favorites);
  }

  private saveToLocalStorage(favorites: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  private loadFromFirestore(uid: string): void {
    const docRef = doc(this.firestore, 'users', uid);
    from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return data['favorites'] || [];
        }
        return [];
      }),
      catchError(() => of([]))
    ).subscribe(favorites => {
      this.favoritesSubject.next(favorites);
      // Merge local favorites if any
      this.mergeLocalFavorites(uid);
    });
  }

  private mergeLocalFavorites(uid: string): void {
    const localFavorites = this.getLocalFavorites();
    if (localFavorites.length > 0) {
      const current = this.favoritesSubject.value;
      const merged = [...new Set([...current, ...localFavorites])];
      this.saveToFirestore(uid, merged);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private getLocalFavorites(): string[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToFirestore(uid: string, favorites: string[]): void {
    const docRef = doc(this.firestore, 'users', uid);
    setDoc(docRef, { favorites }, { merge: true })
      .then(() => this.favoritesSubject.next(favorites))
      .catch(err => console.error('Error saving favorites:', err));
  }

  addFavorite(bookId: string): void {
    const current = this.favoritesSubject.value;
    if (current.includes(bookId)) {
      return;
    }

    const updated = [...current, bookId];
    // Update state immediately for UI responsiveness
    this.favoritesSubject.next(updated);

    user(this.auth).pipe(
      switchMap(currentUser => {
        if (currentUser) {
          const docRef = doc(this.firestore, 'users', currentUser.uid);
          return from(setDoc(docRef, { favorites: updated }, { merge: true })).pipe(
            catchError(err => {
              console.error('Error adding favorite:', err);
              return of(void 0);
            })
          );
        } else {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
          return of(void 0);
        }
      })
    ).subscribe();
  }

  removeFavorite(bookId: string): void {
    const current = this.favoritesSubject.value;
    const updated = current.filter(id => id !== bookId);
    
    // Update state immediately for UI responsiveness
    this.favoritesSubject.next(updated);

    user(this.auth).pipe(
      switchMap(currentUser => {
        if (currentUser) {
          const docRef = doc(this.firestore, 'users', currentUser.uid);
          return from(setDoc(docRef, { favorites: updated }, { merge: true })).pipe(
            catchError(err => {
              console.error('Error removing favorite:', err);
              return of(void 0);
            })
          );
        } else {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
          return of(void 0);
        }
      })
    ).subscribe();
  }

  isFavorite(bookId: string): Observable<boolean> {
    return this.favorites$.pipe(
      map(favorites => favorites.includes(bookId))
    );
  }

  getFavorites(): string[] {
    return this.favoritesSubject.value;
  }
}
