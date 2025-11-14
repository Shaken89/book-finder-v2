import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css'
})
export class ItemCard {
  @Input() book!: Book;

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
}