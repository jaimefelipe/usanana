import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarreraComponent } from './carrera/carrera.component';
import { CursoComponent } from './curso/curso.component';
import { AcademicoAuthGuard } from '../core/guards/academico-auth.guard';

const routes: Routes = [
  { path: 'carrera', component: CarreraComponent, canActivate: [AcademicoAuthGuard] },
  { path: 'curso', component: CursoComponent, canActivate: [AcademicoAuthGuard] }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
}) 
export class ConfigRoutingModule { }
