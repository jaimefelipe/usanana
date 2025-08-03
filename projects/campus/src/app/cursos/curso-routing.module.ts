import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursoVisorComponent } from './curso-visor/curso-visor.component';
import { SemanaEstudioComponent } from './semana-estudio/semana-estudio.component';

const routes: Routes = [
  {path : 'curso', component : CursoVisorComponent},
  {path : 'semana', component : SemanaEstudioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursoRoutingModule { }
