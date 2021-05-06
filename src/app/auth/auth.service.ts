import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  private signupApiUrl = environment.signupApiUrl;
  private loginApiUrl = environment.loginApiUrl;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  singup(email: string, cred: string) {
    return this.http.post<AuthResponseData>(
      this.signupApiUrl,
      {
        email,
        password: cred,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        this.handleAuthentication(response);
      }));
  }

  login(email: string, cred: string) {
    return this.http.post<AuthResponseData>(
      this.loginApiUrl,
      {
        email,
        password: cred,
        returnSecureToken: true,
      }
    ).pipe(catchError(this.handleError),
      tap(response => {
        this.handleAuthentication(response);
      }));
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  lougout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.lougout();
    }, expirationDuration);
  }

  private handleAuthentication(response) {
    const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
    const user = new User(response.email, response.localId, response.idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(+response.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
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

    return throwError(errorMessage);
  }
}
