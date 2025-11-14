import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { ItemsList } from './components/items-list/items-list';
import { ItemDetails } from './components/item-details/item-details';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'items', component: ItemsList },
  { path: 'items/:id', component: ItemDetails },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' }
];