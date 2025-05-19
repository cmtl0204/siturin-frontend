import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { map } from 'rxjs/operators';
import { ProgramInterface } from '@modules/core/interfaces';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CatalogueHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/common/catalogues`;
    private readonly _customMessageService = inject(CustomMessageService);

    findCache(): Observable<HttpResponseInterface> {
        const url = `${this._apiUrl}/cache/get`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findOne(id: string) {
        const url = `${this._apiUrl}/${id}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findByUser(userId: string) {
        const url = `${this._apiUrl}/users/${userId}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                const data = response.data;

                const startedAt = data?.startedAt ? new Date(data.startedAt) : null;
                const endedAt = data?.endedAt ? new Date(data.endedAt) : null;

                return {
                    ...data,
                    startedAt,
                    endedAt
                };
            })
        );
    }

    upload(payload: FormData, modelId: string, typeId: string) {
        const url = `${this._apiUrl}/${modelId}`;

        const params = new HttpParams().append('typeId', typeId);

        return this._httpClient.post<HttpResponseInterface>(url, payload, { params }).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    update(id: string, payload: ProgramInterface) {
        const url = `${this._apiUrl}/${id}`;

        return this._httpClient.put<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    delete(id: string) {
        const url = `${this._apiUrl}/${id}`;

        return this._httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }
}
