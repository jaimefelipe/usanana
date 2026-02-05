import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CobroAcademicoComponent } from './cobro-academico/cobro-academico.component';
import { AcademicoAuthGuard } from '../core/guards/academico-auth.guard';

const routes: Routes = [
  { path: 'cobroacademico', component: CobroAcademicoComponent, canActivate: [AcademicoAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule { }
