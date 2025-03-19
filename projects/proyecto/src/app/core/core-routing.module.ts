import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';
//import { PeopleComponent } from '../../../../main/src/app/general/people/people.component';


const routes: Routes = [
  {path : '', component : FullComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
