import { createAction, props } from '@ngrx/store';
import { Book } from '../../models/book.model';

export const loadItems = createAction(
  '[Items] Load Items',
  props<{ query?: string }>()
);

export const loadItemsSuccess = createAction(
  '[Items] Load Items Success',
  props<{ items: Book[] }>()
);

export const loadItemsFailure = createAction(
  '[Items] Load Items Failure',
  props<{ error: string }>()
);

export const loadItem = createAction(
  '[Items] Load Item',
  props<{ id: string }>()
);

export const loadItemSuccess = createAction(
  '[Items] Load Item Success',
  props<{ item: Book }>()
);

export const loadItemFailure = createAction(
  '[Items] Load Item Failure',
  props<{ error: string }>()
);

export const clearSelectedItem = createAction(
  '[Items] Clear Selected Item'
);