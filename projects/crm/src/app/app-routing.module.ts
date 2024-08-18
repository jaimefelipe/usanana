import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasComponent } from './tareas/tareas/tareas.component';
import { ClientesComponent } from './clientes/clientes/clientes.component';
import { ProspeccionComponent } from './prospecto/prospeccion/prospeccion.component';

const routes: Routes = [
  {path : 'tareas', component : TareasComponent},
  {path : 'clientes', component : ClientesComponent},
  {path : 'prospectos', component : ProspeccionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
