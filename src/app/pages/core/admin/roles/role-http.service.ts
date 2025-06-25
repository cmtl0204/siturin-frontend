import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Role } from '@modules/core/interfaces/role.interface';

@Injectable({ providedIn: 'root' })
export class RolesHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/admin/roles`;

    getAll() {
        return this._httpClient.get<{ data: Role[] }>(this._apiUrl).pipe(
            map(response => response.data)
        );
    }

    getOne(id: string) {
        return this._httpClient.get<{ data: Role }>(`${this._apiUrl}/${id}`).pipe(
            map(response => response.data)
        );
    }

    create(payload: Role) {
        return this._httpClient.post<{ data: Role }>(this._apiUrl, payload).pipe(
            map(response => response.data)
        );
    }

    update(id: string, payload: Role) {
        return this._httpClient.put<{ data: Role }>(`${this._apiUrl}/${id}`, payload).pipe(
            map(response => response.data)
        );
    }

    delete(id: string) {
        return this._httpClient.delete<{ data: any }>(`${this._apiUrl}/${id}`).pipe(
            map(response => response.data)
        );
    }
}