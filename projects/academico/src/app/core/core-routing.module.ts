import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';
import { AcademicoAuthGuard } from './guards/academico-auth.guard';
import { NovedadesComponent } from './novedades/novedades.component';


const routes: Routes = [
  {path : '', component : FullComponent, canActivate: [AcademicoAuthGuard]},
  {path : 'novedades', component : NovedadesComponent, canActivate: [AcademicoAuthGuard]},
  {path : '', loadChildren: () => import('../lms/lms.module').then(m => m.LmsModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
