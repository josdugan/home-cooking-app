import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { AuthService } from './auth.service';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private storeSubscription: Subscription;

  constructor(private auth: AuthService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  ngOnDestroy() {
    this.storeSubscription?.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    }
    else {
      this.store.dispatch(new AuthActions.SignupStart({email, password}));
    }

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }
}
