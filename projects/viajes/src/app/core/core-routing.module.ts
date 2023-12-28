import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './layaut/full/full.component';
import { PlaceComponent } from './place/place.component';
import { CoordinateComponent } from './coordinate/coordinate.component';
import { PaqueteComponent } from './paquete/paquete.component';

const routes: Routes = [
  {path : '', component : FullComponent},
  {path : 'lugar', component : PlaceComponent},
  {path : 'coordina', component : CoordinateComponent},
  {path : 'paquete', component : PaqueteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
