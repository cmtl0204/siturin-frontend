import { inject, Injectable } from '@angular/core';
import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@modules/auth/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const _authService = inject(AuthService);
    let headers = req.headers ? req.headers : new HttpHeaders();

    if (_authService.accessToken) {
        headers = headers.append('Authorization', _authService.accessToken.replace(/"/g, ''));
    }

    return next(req.clone({ headers }));
};
