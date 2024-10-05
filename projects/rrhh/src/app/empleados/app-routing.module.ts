import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadosComponent } from './empleados/empleados.component';
import { AccionPersonalComponent } from './accion-personal/accion-personal.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { PuestoComponent } from './puesto/puesto.component';
import { LocalidadComponent } from './localidad/localidad.component';
import { RollComponent } from './roll/roll.component';
import { ProgramacionComponent } from './programacion/programacion.component';

const routes: Routes = [
  {path : 'empleados', component : EmpleadosComponent},
  {path : 'accionpersonal', component : AccionPersonalComponent},
  {path : 'departamento', component : DepartamentoComponent},
  {path : 'puesto', component : PuestoComponent},
  {path : 'localidad', component : LocalidadComponent},
  {path : 'roll', component : RollComponent},
  {path : 'programacion', component : ProgramacionComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
