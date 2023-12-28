import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';
import { FacturaComponentC } from '../../../../main/src/app/general/facturaC/facturaC.component';

const routes: Routes = [
  {path : '', component : FullComponent},
  {path : 'facturaerror', component : FacturaComponentC},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
