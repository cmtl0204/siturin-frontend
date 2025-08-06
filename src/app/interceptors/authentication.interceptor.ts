import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CoreService } from '@utils/services/core.service';
import { AuthService } from '@modules/auth/auth.service';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
    const _coreService = inject(CoreService);
    const _authService = inject(AuthService);
    const _router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            // Cuando el usuario no está autenticado
            if (error.status === 401) {
                _authService.removeLogin();
            }

            // Cuando el usuario no tiene permisos para acceder al recurso solicitado y se encuentra logueado
            if (error.status === 403 && _authService.accessToken) {
                _authService.removeLogin();
            }

            // Cuando el usuario no tiene permisos para acceder al recurso solicitado y no está logueado
            if (error.status === 403 && !_authService.accessToken) {
                _authService.removeLogin();
            }

            // Cuando el usuario está suspendido
            if (error.status === 429) {
                _authService.removeLogin();
            }

            // Cuando la aplicación o una ruta está en mantenimiento
            if (error.status === 503) {
                _authService.removeLogin();
                _coreService.serviceUnavailable = error.error.data;
                _router.navigateByUrl(MY_ROUTES.signIn);
            }

            return throwError(() => error);
        })
    );
};
