import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasMainComponent } from './tareas-main/tareas-main.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';

const routes: Routes = [
  {path : 'tareas', component : TareasMainComponent},
  {path : 'seguimiento', component : SeguimientoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TareasRoutingModule { }
