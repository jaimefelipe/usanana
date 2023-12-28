import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './people/people.component';
import { ParametrosCiaComponent } from './parametros-cia/parametros-cia.component';
import { FacturaComponentC } from './facturaC/facturaC.component';
import { LicenciaComponent } from './licencia/licencia.component';
import { ConsecutivoComponent } from './consecutivo/consecutivo.component';

const routes: Routes = [
  {path : 'contactos', component : PeopleComponent},
  {path : 'paramxcia', component : ParametrosCiaComponent},
  {path : 'facturaerror', component : FacturaComponentC},
  {path : 'licencias', component : LicenciaComponent},
  {path : 'consecutivos', component : ConsecutivoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
