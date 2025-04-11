import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { LogoutPageComponent } from './modules/logout-page/logout-page.component';
import { HomePageComponent } from './modules/home-page/home-page.component';
import { UserManagementComponent } from './modules/admin/user-management/user-management.component';

export const routes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: "logout", component: LogoutPageComponent},
    {path: "home", component: HomePageComponent},
    {path: "admin/users", component: UserManagementComponent}
];
