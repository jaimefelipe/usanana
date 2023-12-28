import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { FacturaComponent } from './pages/facturas/facturas.component';

const routes: Routes = [
  {path : '', component : FullComponent},
  {path : 'perfil', component : PerfilComponent},
  {path : 'facturas', component : FacturaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
