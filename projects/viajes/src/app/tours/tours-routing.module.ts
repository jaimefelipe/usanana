import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TourComponent } from './tour/tour.component';
import { TarifaTourComponent } from './tarifa-tour/tarifa-tour.component';

const routes: Routes = [
  { path: 'tour', component: TourComponent },
  { path: 'tourrate', component: TarifaTourComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToursRoutingModule { }
