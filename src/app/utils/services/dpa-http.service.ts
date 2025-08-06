import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DpaHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/common/dpa`;
    private readonly _customMessageService = inject(CustomMessageService);

    findCache(): Observable<HttpResponseInterface> {
        const url = `${this._apiUrl}/cache`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
