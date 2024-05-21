import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [
   {path:'login',component:LoginComponent}, 
   {path:'new-password/:token',component:ChangePasswordComponent}, 
  { path: "", redirectTo:'login',pathMatch:'full' },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
