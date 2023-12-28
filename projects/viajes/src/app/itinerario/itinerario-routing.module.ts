import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItinerarioComponent } from './itinerario/itinerario.component';
import { TransportItineraryComponent } from './transport-itinerary/transport-itinerary.component';

const routes: Routes = [
  { path: 'itinerarios', component: ItinerarioComponent },
  { path: 'transitinerarios', component: TransportItineraryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItinerarioRoutingModule { }
