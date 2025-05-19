import { Injectable, signal } from '@angular/core';
import { PaginatorInterface } from '@utils/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CoreService {
    private _isLoading = signal(false);
    readonly loading = this._isLoading.asReadonly();

    private _isProcessing = signal(false);
    readonly processing = this._isProcessing.asReadonly();

    private _higherSort: number = 1;
    private _sidebarVisible: boolean = false;

    constructor() {}

    updateSystem() {
        this.version = this.newVersion;
        // this.cataloguesHttpService.findCache().subscribe(() => {
        //   // location.reload();
        // });
        //
        // this.locationsHttpService.findCache().subscribe(() => {
        //   // location.reload();
        // });
    }

    showLoading(): void {
        this._isLoading.set(true);
    }

    hideLoading() {
        this._isLoading.set(false);
    }

    showProcessing(): void {
        this._isProcessing.set(true);
    }

    hideProcessing() {
        this._isProcessing.set(false);
    }

    get paginator(): PaginatorInterface {
        return { page: 0, limit: 10, totalItems: 0, firstItem: 1, lastPage: 1, lastItem: 1 };
    }

    get serviceUnavailable() {
        return JSON.parse(String(sessionStorage.getItem('serviceUnavailable')));
    }

    set serviceUnavailable(value: any) {
        sessionStorage.setItem('serviceUnavailable', JSON.stringify(value));
    }

    get version() {
        return JSON.parse(String(localStorage.getItem('version')));
        // return JSON.parse(String(sessionStorage.getItem('version')));
    }

    set version(value: any) {
        localStorage.setItem('version', JSON.stringify(value));
        // sessionStorage.setItem('version', JSON.stringify(value));
    }

    get newVersion() {
        return JSON.parse(String(localStorage.getItem('newVersion')));
        // return JSON.parse(String(sessionStorage.getItem('newVersion')));
    }

    set newVersion(value: any) {
        localStorage.setItem('newVersion', JSON.stringify(value));
        // sessionStorage.setItem('newVersion', JSON.stringify(value));
    }

    get higherSort() {
        return this._higherSort;
    }

    set higherSort(value: number) {
        this._higherSort = value;
    }

    get sidebarVisible() {
        return this._sidebarVisible;
    }

    set sidebarVisible(value: boolean) {
        this._sidebarVisible = value;
    }
}
