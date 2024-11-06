import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';



const routes: Routes = [
  {path : '', component : FullComponent},
  //{path : 'clientes', component : ClientesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
