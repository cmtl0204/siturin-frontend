import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpHeaders, HttpParams } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { CoreService } from '@utils/services/core.service';

export const coreInterceptor: HttpInterceptorFn = (req, next) => {
    let flag: boolean | undefined = false;
    const coreService = inject(CoreService);
    let headers = req.headers ? req.headers : new HttpHeaders();
    let params = req.params ? req.params : new HttpParams();

    if (headers.get('pagination')) {
        if (!params.get('page')) {
            params = params.append('page', coreService.paginator.page);
        }

        if (!params.get('limit')) {
            params = params.append('limit', coreService.paginator.limit);
        }
    }

    // headers = headers.append('Accept', 'application/json');
    //
    // flag = req.headers.getAll('Content-Type')?.some((header) => header === 'multipart/form-data');
    //
    // if (!flag) {
    //     headers = headers.append('Content-Type', 'application/json');
    // }

    switch (req.method) {
        case 'POST':
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
            coreService.showProcessing();
            break;
    }

    coreService.showLoading();

    return next(req.clone({ headers, params })).pipe(
        finalize(() => {
            coreService.hideProcessing();
            coreService.hideLoading();
        })
    );
};
