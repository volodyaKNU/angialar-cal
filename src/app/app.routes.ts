import { Routes } from '@angular/router';
import { Lab4DevicesComponent } from './lab4-devices/lab4-devices.component';
import { OneDArrayComponent } from './one-d-array.component';
import { TwoDArrayComponent } from './two-d-array.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lab4' },
  { path: 'lab4', component: Lab4DevicesComponent },
  { path: 'array-1d', component: OneDArrayComponent },
  { path: 'array-2d', component: TwoDArrayComponent },
  { path: '**', redirectTo: 'lab4' },
];
