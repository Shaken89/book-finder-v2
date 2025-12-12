import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Book, BooksResponse } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  getItems(query?: string, page: number = 0, maxResults: number = 10): Observable<Book[]> {
    const searchQuery = query || 'fiction';
    const startIndex = page * maxResults;
    const url = `${this.apiUrl}?q=${searchQuery}&startIndex=${startIndex}&maxResults=${maxResults}`;
    
    return this.http.get<BooksResponse>(url).pipe(
      map(response => response.items || []),
      catchError(error => {
        console.error('Error fetching items:', error);
        return of([]);
      })
    );
  }

  getItemById(id: string): Observable<Book | null> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(null))
    );
  }
}