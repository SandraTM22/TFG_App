import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { UserManagementComponent } from './modules/admin/user-dashboard/user-management.component';
import { authGuard } from './shared/guard/auth.guard';
import { FeeManagementComponent } from './modules/fee-management/fee-management.component';
import { UnauthorizedComponent } from './modules/unauthorized/unauthorized.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },  
  /* { path: 'home', component: HomePageComponent, canActivate: [authGuard] }, */ //CFutura vista expedientes
  {
    path: 'admin/users',
    component: UserManagementComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'costas',
    component: FeeManagementComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
