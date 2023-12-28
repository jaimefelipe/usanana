import { RestaurantKitchenComponent } from './restaurant-kitchen/restaurant-kitchen.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantZoneComponent } from './restaurant-zone/restaurant-zone.component';
import { RestaurantPlaceComponent } from './restaurant-place/restaurant-place.component';
import { RestaurantInvoiceComponent } from './restaurant-invoice/restaurant-invoice.component';
import { ReportComponent } from './report/report.component';
import { PlanoComponent } from './plano/plano.component';
import { RestaurantConsultaPedidoComponent } from './restaurant-consulta-pedido/restaurant-consulta-pedido.component';
import { RestaurantOrderMainComponent } from './restaurant-order-main/restaurant-order-main.component';
import { PlaceMapComponent } from './place-map/place-map.component';


const routes: Routes = [
  {path : 'restaurantinvoice', component : RestaurantInvoiceComponent},
  {path : 'restaurantzone', component : RestaurantZoneComponent},
  {path : 'restaurantplace', component : RestaurantPlaceComponent},
  {path : 'restaurantkitchen', component : RestaurantKitchenComponent},
  {path : 'reporteVenta', component : ReportComponent},
  {path : 'plano', component : PlanoComponent},
  {path : 'consultapedido', component : RestaurantConsultaPedidoComponent},
  {path : 'ordermain', component : RestaurantOrderMainComponent},
  {path : 'placemap', component : PlaceMapComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
