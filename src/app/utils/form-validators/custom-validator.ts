import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, Observable, of, switchMap, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthHttpService } from '@modules/auth/auth-http.service';

export function invalidEmailValidator(): ValidatorFn {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return !value || emailRegex.test(value) ? null : { invalidEmail: true };
    };
}

export function invalidEmailMINTURValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return !value || value.includes('@turismo.gob.ec') ? { invalidEmailMINTUR: true } : null;
    };
}

export function registeredIdentificationValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyIdentification(value).pipe(map((response) => (response ? { registeredIdentification: true } : null))))
        );
    };
}

export function unregisteredUserValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyIdentification(value).pipe(map((response) => (response ? null : { unregisteredUser: true }))))
        );
    };
}

export function pendingPaymentRucValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyRucPendingPayment(value).pipe(map((response) => (response ? { pendingPaymentRuc: true } : null))))
        );
    };
}
