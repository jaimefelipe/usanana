import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrupoProfesorComponent } from './grupo-profesor/grupo-profesor.component';
import { AcademicoAuthGuard } from '../core/guards/academico-auth.guard';

const routes: Routes = [
  { path: 'grupoprofesor', component: GrupoProfesorComponent, canActivate: [AcademicoAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesorRoutingModule { }
