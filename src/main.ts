import { provideZoneChangeDetection, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ItemsEffects } from './app/items/state/items.effects';
import { itemsReducer } from './app/items/state/items.reducer';
import { provideServiceWorker } from '@angular/service-worker';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideZoneChangeDetection(),
    ...appConfig.providers,
    provideStore({ items: itemsReducer }),
    provideEffects([ItemsEffects]),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
}).catch(err => console.error(err));
