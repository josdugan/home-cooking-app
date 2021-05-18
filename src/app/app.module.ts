import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRouterModule } from './app-router/app-router.module';
import { AppComponent } from './app.component';
import { AuthEffects } from './auth/store/auth.effects';
import { CoreModule } from './core.module';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import * as fromApp from './store/app.reducer';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRouterModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
