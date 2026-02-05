import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';
import { AcademicoAuthGuard } from './guards/academico-auth.guard';


const routes: Routes = [
  {path : '', component : FullComponent, canActivate: [AcademicoAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
