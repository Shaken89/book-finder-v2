import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Book } from '../../models/book.model';
import * as ItemsActions from '../../items/state/items.actions';
import * as ItemsSelectors from '../../items/state/items.selectors';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.html',
  styleUrl: './item-details.css'
})
export class ItemDetailsComponent implements OnInit, OnDestroy {
  book$: Observable<Book | null>;
  isLoading$: Observable<boolean>;
  errorMessage$: Observable<string | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.book$ = this.store.select(ItemsSelectors.selectSelectedItem);
    this.isLoading$ = this.store.select(ItemsSelectors.selectDetailsLoading);
    this.errorMessage$ = this.store.select(ItemsSelectors.selectDetailsError);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(ItemsActions.loadItem({ id }));
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(ItemsActions.clearSelectedItem());
  }

  goBack(): void {
    this.location.back();
  }

  getImageUrl(book: Book | null): string {
    return book?.volumeInfo.imageLinks?.thumbnail || 
           book?.volumeInfo.imageLinks?.smallThumbnail || 
           'https://via.placeholder.com/200x300?text=No+Cover';
  }

  getAuthors(book: Book | null): string {
    return book?.volumeInfo.authors?.join(', ') || 'Unknown Author';
  }

  getCategories(book: Book | null): string {
    return book?.volumeInfo.categories?.join(', ') || 'Not specified';
  }
}