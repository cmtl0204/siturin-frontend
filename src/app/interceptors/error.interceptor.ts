import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CoreService } from '@utils/services/core.service';
import { CustomMessageService } from '@utils/services/custom-message.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const _coreService = inject(CoreService);
    const _customMessageService = inject(CustomMessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            _coreService.hideLoading();
            _coreService.hideProcessing();
            _customMessageService.showHttpError(error.error);
            return throwError(() => error);
        })
    );
};
