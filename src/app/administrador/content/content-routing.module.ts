import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from 'src/app/alerts/not-found/not-found.component';
import { DashboardResolve } from './dashboard/resolver/dashboard.resolver';
import { BuildingGuard } from 'src/app/guard/building.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard', component: DashboardComponent,
         resolve: {
          dashboard:DashboardResolve
        }
      },
      {
        path: 'administracion',
        loadChildren: () => import
          ('./administracion/cajas/cajas.module').then(m => m.CajasModule)
      },
      {
        path: 'administracion',
        loadChildren: () => import
          ('./administracion/categorias/categorias.module').then(m => m.CategoriasModule)
      },
      {
        path: 'administracion',
        loadChildren: () => import
          ('./administracion/proveedores/proveedores.module').then(m => m.ProveedoresModule)
      },
      {
        path: 'administracion',
        loadChildren: () => import
          ('./administracion/usuarios/usuarios.module').then(m => m.UsuariosModule)
      },
      {
        path: 'administracion',
        loadChildren: () => import
          ('./administracion/clientes/clientes.module').then(m => m.ClientesModule)
      },
      {
        path: 'productos',
        loadChildren: () => import
          ('./productos/productos.module').then(m => m.ProductosModule)
      },
      {
        path: 'compras',
        loadChildren: () => import
          ('./compras/compras.module').then(m => m.ComprasModule),canActivate:[BuildingGuard]
      },
      {
        path: 'ventas',
        loadChildren: () => import
          ('./ventas/ventas.module').then(m => m.VentasModule),canActivate:[BuildingGuard]
      },
      {
        path: 'devoluciones',
        loadChildren: () => import
          ('./devoluciones/devoluciones.module').then(m => m.DevolucionesModule),canActivate:[BuildingGuard]
      },
      {
        path: 'kardex',
        loadChildren: () => import
          ('./kardex/kardex.module').then(m => m.KardexModule),canActivate:[BuildingGuard]
      },
      {
        path: 'reportes',
        loadChildren: () => import
          ('./reportes/reportes.module').then(m => m.ReportesModule),canActivate:[BuildingGuard]
      },
      {
        path: 'configuraciones',
        loadChildren: () => import
          ('./configuraciones/configuraciones.module').then(m => m.ConfiguracionesModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: "**", component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
