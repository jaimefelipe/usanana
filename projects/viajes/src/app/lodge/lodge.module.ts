import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LodgeRoutingModule } from './lodge-routing.module';
import { HotelComponent } from './hotel/hotel.component';
import { TipoHabitacionComponent } from './tipo-habitacion/tipo-habitacion.component';
import { TarifaHotelComponent } from './tarifa-hotel/tarifa-hotel.component';


@NgModule({
  declarations: [HotelComponent,TipoHabitacionComponent,TarifaHotelComponent],
  imports: [
    CommonModule,
    LodgeRoutingModule,
    NgbModule,
    FormsModule
  ]
})
export class LodgeModule { }
