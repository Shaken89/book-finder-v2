import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';
import { FavoritesService } from '../../services/favorites';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css'
})
export class ItemCard implements OnInit {
  @Input() book!: Book;
  isFavorite$!: Observable<boolean>;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.isFavorite$ = this.favoritesService.isFavorite(this.book.id);
  }

  getImageUrl(): string {
    return this.book.volumeInfo.imageLinks?.thumbnail || 
           this.book.volumeInfo.imageLinks?.smallThumbnail || 
           'https://via.placeholder.com/128x192?text=No+Cover';
  }

  getAuthors(): string {
    return this.book.volumeInfo.authors?.join(', ') || 'Unknown Author';
  }

  getDescription(): string {
    const desc = this.book.volumeInfo.description || 'No description available';
    return desc.length > 150 ? desc.substring(0, 150) + '...' : desc;
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.favoritesService.isFavorite(this.book.id).pipe(take(1)).subscribe(isFav => {
      if (isFav) {
        this.favoritesService.removeFavorite(this.book.id);
      } else {
        this.favoritesService.addFavorite(this.book.id);
      }
    });
  }
}