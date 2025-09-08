import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpHeaders, HttpParams } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { CoreService } from '@utils/services/core.service';
import { CustomMessageService } from '@utils/services';

export const coreInterceptor: HttpInterceptorFn = (req, next) => {
    let flag: boolean | undefined = false;
    const coreService = inject(CoreService);
    const customMessageService = inject(CustomMessageService);
    let headers = req.headers ? req.headers : new HttpHeaders();
    let params = req.params ? req.params : new HttpParams();

    if (params.get('page')) {
        if (!params.get('limit')) {
            params = params.append('limit', '2');
        }
    }

    // headers = headers.append('Accept', 'application/json');
    //
    // flag = req.headers.getAll('Content-Type')?.some((header) => header === 'multipart/form-data');
    //
    // if (!flag) {
    //     headers = headers.append('Content-Type', 'application/json');
    // }



    coreService.showLoading();

    return next(req.clone({ headers, params })).pipe(
        finalize(() => {
            switch (req.method) {
                case 'POST':
                case 'PUT':
                case 'PATCH':
                case 'DELETE':
                    coreService.showProcessing();
                    customMessageService.showHttpSuccess(req);
                    break;
            }

            coreService.hideProcessing();
            coreService.hideLoading();
        })
    );
};
