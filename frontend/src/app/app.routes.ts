import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { LogoutPageComponent } from './modules/logout-page/logout-page.component';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { UserManagementComponent } from './modules/admin/user-management/user-management.component';
import { authGuard } from './shared/guard/auth.guard';

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
  //cuando tenga ruta para las costas
  /* {
    path: 'costas',
    component: CostasComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_SUPER'] }
  }, */
];
