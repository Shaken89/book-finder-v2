import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from '../../services/items';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.html',
  styleUrl: './item-details.css'
})
export class ItemDetails implements OnInit {
  book: Book | null = null;
  isLoading: boolean = true;
  notFound: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private itemsService: ItemsService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBookDetails(id);
      }
    });
  }

  loadBookDetails(id: string): void {
    this.isLoading = true;
    this.notFound = false;
    this.errorMessage = '';

    this.itemsService.getItemById(id).subscribe({
      next: (data) => {
        if (data) {
          this.book = data;
        } else {
          this.notFound = true;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load book details.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getImageUrl(): string {
    return this.book?.volumeInfo.imageLinks?.thumbnail || 
           this.book?.volumeInfo.imageLinks?.smallThumbnail || 
           'https://via.placeholder.com/200x300?text=No+Cover';
  }

  getAuthors(): string {
    return this.book?.volumeInfo.authors?.join(', ') || 'Unknown Author';
  }

  getCategories(): string {
    return this.book?.volumeInfo.categories?.join(', ') || 'Not specified';
  }
}