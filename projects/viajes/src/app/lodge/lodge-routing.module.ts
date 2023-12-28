import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelComponent } from './hotel/hotel.component';
import { TipoHabitacionComponent } from './tipo-habitacion/tipo-habitacion.component';
import { TarifaHotelComponent } from './tarifa-hotel/tarifa-hotel.component';

const routes: Routes = [
  { path: 'hotel', component: HotelComponent },
  { path: 'tipohabitacion', component: TipoHabitacionComponent },
  { path: 'tarifahotel', component: TarifaHotelComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LodgeRoutingModule { }
