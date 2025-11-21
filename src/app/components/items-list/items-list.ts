import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsService } from '../../services/items';
import { ItemCard } from '../item-card/item-card';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [FormsModule, ItemCard],
  templateUrl: './items-list.html',
  styleUrl: './items-list.css'
})
export class ItemsList implements OnInit {
  books: Book[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.loadBooks();
    });
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.itemsService.getItems(this.searchQuery).subscribe({
      next: (data) => {
        this.books = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load books. Please try again.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  onSearch(): void {
    this.router.navigate(['/items'], { 
      queryParams: { q: this.searchQuery || null } 
    });
  }
}