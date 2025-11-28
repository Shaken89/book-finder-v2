import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './items.reducer';

export const selectItemsState = createFeatureSelector<ItemsState>('items');

export const selectAllItems = createSelector(
  selectItemsState,
  (state) => state.items
);

export const selectListLoading = createSelector(
  selectItemsState,
  (state) => state.listLoading
);

export const selectListError = createSelector(
  selectItemsState,
  (state) => state.listError
);

export const selectSelectedItem = createSelector(
  selectItemsState,
  (state) => state.selectedItem
);

export const selectDetailsLoading = createSelector(
  selectItemsState,
  (state) => state.detailsLoading
);

export const selectDetailsError = createSelector(
  selectItemsState,
  (state) => state.detailsError
);