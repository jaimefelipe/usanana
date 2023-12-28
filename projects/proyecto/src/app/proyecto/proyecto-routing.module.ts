import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProyTreeComponent } from './proy-tree/proy-tree.component';
import { ProyectoComponent } from './proyecto/proyecto.component';

const routes: Routes = [
  {path : 'proyecto', component : ProyectoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectoRoutingModule { }
