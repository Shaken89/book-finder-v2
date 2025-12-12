import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites';
import { ItemsService } from '../../services/items';
import { Book } from '../../models/book.model';
import { ItemCard } from '../item-card/item-card';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ItemCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent implements OnInit {
  favoriteBooks: Book[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private favoritesService: FavoritesService,
    private itemsService: ItemsService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    const favoriteIds = this.favoritesService.getFavorites();

    if (favoriteIds.length === 0) {
      this.isLoading = false;
      this.favoriteBooks = [];
      return;
    }

    const requests = favoriteIds.map(id =>
      this.itemsService.getItemById(id).pipe(
        catchError(() => of(null))
      )
    );

    forkJoin(requests).subscribe({
      next: (books) => {
        this.favoriteBooks = books.filter(book => book !== null) as Book[];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error loading favorites';
        this.isLoading = false;
      }
    });
  }

  onRemoveFavorite(bookId: string): void {
    this.favoritesService.removeFavorite(bookId);
    // Reload after a small delay to allow Firestore to update
    setTimeout(() => this.loadFavorites(), 300);
  }
}
