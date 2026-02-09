import { HttpInterceptorFn } from '@angular/common/http';

// intercepts every http request leaving, adds cookies to request
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const cloned = req.clone({
        withCredentials: true
    });
    return next(cloned);
};
