import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';
import { FacturarComponent } from './layaut/facturar/facturar.component';
import { TransaccionesComponent } from './layaut/transacciones/transacciones.component';


const routes: Routes = [
  {path : '', component : FullComponent},
  {path : 'facturar', component : FacturarComponent},
  {path : 'transacciones', component : TransaccionesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
