import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from './reportes.component';
import { ReporteDeVentaComponent } from './reporte-de-venta/reporte-de-venta.component';
import { ReporteDeInventarioComponent } from './reporte-de-inventario/reporte-de-inventario.component';

const routes: Routes = [
  {
    path: '', component: ReportesComponent,
    children: [
      { path: "reportes de venta", component: ReporteDeVentaComponent },
      { path: "reportes de inventario", component: ReporteDeInventarioComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
