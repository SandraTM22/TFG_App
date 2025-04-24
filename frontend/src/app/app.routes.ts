import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { LogoutPageComponent } from './modules/logout-page/logout-page.component';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { UserManagementComponent } from './modules/admin/user-management/user-management.component';
import { authGuard } from './shared/guard/auth.guard';
import { FeeManagementComponent } from './modules/fee-management/fee-management.component';
import { UnauthorizedComponent } from './modules/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'logout', component: LogoutPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [authGuard] },
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
    data: { roles: ['ROLE_SUPER','ROLE_ADMIN'] },
  },
  {
    path: 'unauthorized', component: UnauthorizedComponent
  }
];
