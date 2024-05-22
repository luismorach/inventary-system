import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ErrorHandlerService } from './services/errorHandler/error-handler.service';
import { ApiInterceptor  } from './interceptor/api.interceptor';
import { AlertsModule } from './alerts/alerts.module';
import { ErrorApiInterceptor } from './interceptor/error-api.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AlertsModule,
    HttpClientModule
  ],
  providers: [{provide:ErrorHandler,useClass:ErrorHandlerService } ,
    {provide:HTTP_INTERCEPTORS,useClass:ApiInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:ErrorApiInterceptor,multi:true} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
