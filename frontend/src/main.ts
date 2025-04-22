import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/shared/helpers/auth.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // mantiene los providers existentes
    provideHttpClient(withInterceptors([
      authInterceptor,
    ])),            // agrega HttpClient
  ]
}).catch((err) => console.error(err));
