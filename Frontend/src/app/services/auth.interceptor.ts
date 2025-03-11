import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
//debug
console.log("Interceptor Loaded");

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); 
  const token = authService.getToken();
  //debug
  console.log("Interceptor Token:", token);

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `${token}`, 
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
