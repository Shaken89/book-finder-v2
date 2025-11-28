import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ItemsEffects } from './app/items/state/items.effects';
import { itemsReducer } from './app/items/state/items.reducer';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideZoneChangeDetection(),
    ...appConfig.providers,
    provideStore({ items: itemsReducer }),
    provideEffects([ItemsEffects])
  ]
}).catch(err => console.error(err));
