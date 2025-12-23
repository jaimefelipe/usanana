import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursoVisorComponent } from './curso-visor/curso-visor.component';
import { SemanaEstudioComponent } from './semana-estudio/semana-estudio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { MatriculaEstudianteComponent } from './matricula-estudiante/matricula-estudiante.component';

const routes: Routes = [
  {path : 'curso', component : CursoVisorComponent},
  {path : 'semana', component : SemanaEstudioComponent},
  {path : 'perfil', component : PerfilComponent},
  {path : 'matricula', component : MatriculaEstudianteComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursoRoutingModule { }
