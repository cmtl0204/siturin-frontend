import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@modules/auth/auth.service';
import { MY_ROUTES } from '@routes';

export const tokenGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.accessToken) {
        return true;
    }

    authService.removeLogin();

    return false;
};
