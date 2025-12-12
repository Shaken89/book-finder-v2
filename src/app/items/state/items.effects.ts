import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs';
import { ItemsService } from '../../services/items';
import * as ItemsActions from './items.actions';

export class ItemsEffects {
  private actions$ = inject(Actions);
  private itemsService = inject(ItemsService);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      switchMap(({ query, page, limit }) =>
        this.itemsService.getItems(query, page || 0, limit || 10).pipe(
          map(items => ItemsActions.loadItemsSuccess({ items })),
          catchError(error =>
            of(ItemsActions.loadItemsFailure({ error: error.message || 'Failed to load items' }))
          )
        )
      )
    )
  );

  loadItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItem),
      switchMap(({ id }) =>
        this.itemsService.getItemById(id).pipe(
          map(item =>
            item
              ? ItemsActions.loadItemSuccess({ item })
              : ItemsActions.loadItemFailure({ error: 'Item not found' })
          ),
          catchError(error =>
            of(ItemsActions.loadItemFailure({ error: error.message || 'Failed to load item' }))
          )
        )
      )
    )
  );
}
