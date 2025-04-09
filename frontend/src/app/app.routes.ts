import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { LogoutPageComponent } from './modules/logout-page/logout-page.component';
import { HomePageComponent } from './modules/home-page/home-page.component';

export const routes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: "logout", component: LogoutPageComponent},
    {path: "home", component: HomePageComponent}
];
