import { Routes } from '@angular/router';
import { CustomerList } from './pages/customer-list/customer-list';
import { CustomerUpsert } from './pages/customer-upsert/customer-upsert';

export const routes: Routes = [
  { path: 'customers', component: CustomerList },
  { path: 'customers/add', component: CustomerUpsert },
  { path: 'customers/edit/:id', component: CustomerUpsert },
  { path: 'customers/:id', component: CustomerUpsert },
  { path: '', redirectTo: '/customers', pathMatch: 'full' }
];
