import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProyTaskComponent } from './proy-task/proy-task.component';

const routes: Routes = [
  {path : 'proyecto', component : ProyTaskComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectoRoutingModule { }
