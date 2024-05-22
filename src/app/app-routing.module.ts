import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from './guard/permissions.guard';
import { NotFoundComponent } from './alerts/not-found/not-found.component';

const appRoutes: Routes = [
   {path:'',loadChildren: () => import
   ('./auth/auth.module').then(m => m.AuthModule),}, 
   {path:"cajero",loadChildren: () => import
   ('./cashier/cashier.module').then(m => m.CashierModule),
   canActivate:[PermissionsGuard]}, 
  {path:"administrador",loadChildren: () => import
  ('./administrador/administrador.module').then(m => m.AdministradorModule),
  canActivate:[PermissionsGuard]}, 
  { path: "", redirectTo:'',pathMatch:'full' },

  { path: "**", component: NotFoundComponent }
 
]


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
