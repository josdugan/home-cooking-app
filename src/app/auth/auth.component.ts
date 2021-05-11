import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password

    this.isLoading = true;

    if (this.isLoginMode) {
      this.login(email, password);
    }
    else {
      this.signup(email, password);
    }

    this.isLoading = false;

    form.reset();
  }

  private login(email: any, password: any) {
    this.auth.login(email, password).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }

  private signup(email: string, password: string) {
    this.auth.singup(email, password).subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
      }
    );
  }

  onHandleError() {
    this.error = null;
  }
}
