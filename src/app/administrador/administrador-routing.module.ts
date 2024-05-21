import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorComponent } from './administrador.component';
import { IsAdminGuard } from '../guard/isAdmin.guard';
import { NotFoundComponent } from '../alerts/not-found/not-found.component';

const routes: Routes = [
  { path: "Error", component: NotFoundComponent },
  {
    path: "", component: AdministradorComponent, children: [
      {
        path: '',
        loadChildren: () => import
          ('./content/content.module').then(m => m.ContentModule), canActivate: [IsAdminGuard]
      },
     
    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
