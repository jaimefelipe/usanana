import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { RestaurantOrderComponent } from './restaurant-order/restaurant-order.component';
import { RestaurantZoneComponent } from './restaurant-zone/restaurant-zone.component';
import { RestaurantPlaceComponent } from './restaurant-place/restaurant-place.component';
import { RestaurantKitchenComponent } from './restaurant-kitchen/restaurant-kitchen.component';
import { RestaurantInvoiceComponent } from './restaurant-invoice/restaurant-invoice.component';
import { ReportComponent } from './report/report.component';
import { PlanoComponent } from './plano/plano.component'
import { RestaurantConsultaPedidoComponent } from './restaurant-consulta-pedido/restaurant-consulta-pedido.component';
import { RestaurantOrderMainComponent } from './restaurant-order-main/restaurant-order-main.component';
import { RestaurantOrderChildComponent } from './restaurant-order-main/restaurant-order-child/restaurant-order-child.component';
import { PlaceMapComponent } from './place-map/place-map.component';


@NgModule({
  declarations: [RestaurantOrderComponent, RestaurantZoneComponent, RestaurantPlaceComponent, RestaurantKitchenComponent, RestaurantInvoiceComponent,ReportComponent, PlanoComponent,RestaurantConsultaPedidoComponent, RestaurantOrderMainComponent, RestaurantOrderChildComponent, PlaceMapComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    RestaurantRoutingModule
  ]
})
export class RestaurantModule { }
