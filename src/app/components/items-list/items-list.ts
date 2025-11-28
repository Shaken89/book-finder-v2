import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ItemCard } from '../item-card/item-card';
import { Book } from '../../models/book.model';
import * as ItemsActions from '../../items/state/items.actions';
import * as ItemsSelectors from '../../items/state/items.selectors';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ItemCard],
  templateUrl: './items-list.html',
  styleUrl: './items-list.css'
})
export class ItemsListComponent implements OnInit {
  books$: Observable<Book[]>;
  isLoading$: Observable<boolean>;
  errorMessage$: Observable<string | null>;
  searchQuery: string = '';

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.books$ = this.store.select(ItemsSelectors.selectAllItems);
    this.isLoading$ = this.store.select(ItemsSelectors.selectListLoading);
    this.errorMessage$ = this.store.select(ItemsSelectors.selectListError);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.store.dispatch(ItemsActions.loadItems({ query: this.searchQuery }));
    });
  }

  onSearch(): void {
    this.router.navigate(['/items'], { 
      queryParams: { q: this.searchQuery || null } 
    });
  }
}