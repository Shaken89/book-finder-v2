import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
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
export class ItemsListComponent implements OnInit, OnDestroy {
  books$: Observable<Book[]>;
  isLoading$: Observable<boolean>;
  errorMessage$: Observable<string | null>;
  searchQuery: string = '';
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  currentPage: number = 0;
  itemsPerPage: number = 10;

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
    // Setup RxJS search with debounceTime, distinctUntilChanged, and switchMap
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        // Update URL with query params
        this.router.navigate(['/items'], { 
          queryParams: { 
            q: query || null,
            page: this.currentPage,
            limit: this.itemsPerPage
          },
          queryParamsHandling: 'merge'
        });
        return [];
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    // Listen to route query params changes
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.currentPage = parseInt(params['page']) || 0;
      this.itemsPerPage = parseInt(params['limit']) || 10;
      this.store.dispatch(ItemsActions.loadItems({ 
        query: this.searchQuery,
        page: this.currentPage
      }));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(): void {
    this.currentPage = 0; // Reset to first page on new search
    this.searchSubject.next(this.searchQuery);
  }

  onItemsPerPageChange(limit: number): void {
    this.itemsPerPage = limit;
    this.currentPage = 0;
    this.router.navigate(['/items'], { 
      queryParams: { 
        q: this.searchQuery || null,
        page: this.currentPage,
        limit: this.itemsPerPage
      }
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.router.navigate(['/items'], { 
      queryParams: { 
        q: this.searchQuery || null,
        page: this.currentPage,
        limit: this.itemsPerPage
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.router.navigate(['/items'], { 
        queryParams: { 
          q: this.searchQuery || null,
          page: this.currentPage,
          limit: this.itemsPerPage
        }
      });
    }
  }
}