import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarreraComponent } from './carrera/carrera.component';
import { CursoComponent } from './curso/curso.component';

const routes: Routes = [
  { path: 'carrera', component: CarreraComponent },
  { path: 'curso', component: CursoComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
}) 
export class ConfigRoutingModule { }
