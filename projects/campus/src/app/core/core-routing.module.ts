import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';
import { LoginCampusComponent } from '../../../../seguridad/src/app/security/login-campus/login-campus.component';
import { PrimerIngresoComponent } from '../cursos/primer-ingreso/primer-ingreso.component';

const routes: Routes = [
  {path : '', component : FullComponent},
  {path : 'login', component : LoginCampusComponent},
  {path : 'primeringreso', component : PrimerIngresoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
