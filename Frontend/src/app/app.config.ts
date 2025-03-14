import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { AuthService } from './services/auth.service';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './services/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';//update
import { importProvidersFrom } from '@angular/core';//update
import { ReactiveFormsModule } from '@angular/forms';//update
import { CommonModule } from '@angular/common';//update

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideAnimations(),//update
    importProvidersFrom(ReactiveFormsModule,CommonModule),//update
    AuthService
  ]
};
