import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CobroAcademicoComponent } from './cobro-academico/cobro-academico.component';

const routes: Routes = [
  { path: 'cobroacademico', component: CobroAcademicoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule { }
