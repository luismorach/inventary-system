import { NgModule } from "@angular/core";
import { LoginComponent } from "../auth/login/login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AlertsModule } from "../alerts/alerts.module";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { UtilsComponentsModule } from "../utilsComponents/utilsComponents.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [
    LoginComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AlertsModule,
    ReactiveFormsModule,
    UtilsComponentsModule
  ]
  
})
export class AuthModule { }
