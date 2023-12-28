import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";


import { ItinerarioRoutingModule } from './itinerario-routing.module';
import { ItinerarioComponent } from './itinerario/itinerario.component';
import { TransportItineraryComponent } from './transport-itinerary/transport-itinerary.component';


@NgModule({
  declarations: [
    ItinerarioComponent,
    TransportItineraryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    CurrencyMaskModule,
    ItinerarioRoutingModule
  ]
})
export class ItinerarioModule { }
