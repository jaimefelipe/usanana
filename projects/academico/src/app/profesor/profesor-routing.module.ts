import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrupoProfesorComponent } from './grupo-profesor/grupo-profesor.component';

const routes: Routes = [
  { path: 'grupoprofesor', component: GrupoProfesorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesorRoutingModule { }
