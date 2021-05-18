import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthResponseData, AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
    private signupApiUrl = environment.signupApiUrl;
    private loginApiUrl = environment.loginApiUrl;

    @Effect() authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(
                this.signupApiUrl,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            )
                .pipe(
                    tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
                    map(resData => this.handleAuthentication(resData)),
                    catchError(errorResponse => this.handleError(errorResponse))
                );
        })
    );

    @Effect() authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                this.loginApiUrl,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true,
                }
            )
                .pipe(
                    tap(resData => this.authService.setLogoutTimer(+resData.expiresIn * 1000)),
                    map(resData => this.handleAuthentication(resData)),
                    catchError(errorResponse => this.handleError(errorResponse)),
                );
        })
    );

    @Effect({ dispatch: false }) authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE),
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    @Effect({ dispatch: false }) authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    );

    @Effect() autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type: 'DUMMY' };
            }

            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

            if (loadedUser.token) {
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.Authenticate({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate)
                });
            }

            return { type: 'DUMMY' };
        })
    )

    constructor(
        private http: HttpClient,
        private router: Router,
        private actions$: Actions,
        private authService: AuthService
    ) { }

    private handleAuthentication(resData: AuthResponseData) {
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        const user = new User(
            resData.email,
            resData.localId,
            resData.idToken,
            expirationDate
        );
        localStorage.setItem('userData', JSON.stringify(user));
        return new AuthActions.Authenticate({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate
        });
    }

    private handleError(errorResponse: any) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
            return of(new AuthActions.AuthenticateFail(errorMessage));
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists';
                break;
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
                errorMessage = 'Email or password is not recognized';
                break;
        }

        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
}