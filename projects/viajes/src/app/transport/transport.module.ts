import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { TransportRoutingModule } from './transport-routing.module';
import { RouteComponent } from './route/route.component';
import { RouteRateComponent } from './route-rate/route-rate.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { VehicleCategoryComponent } from './vehicle-category/vehicle-category.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { VehicleComponent } from './vehicle/vehicle.component';

@NgModule({
  declarations: [RouteComponent, RouteRateComponent, ScheduleComponent,VehicleCategoryComponent, VehicleTypeComponent,VehicleComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TransportRoutingModule
  ]
})
export class TransportModule { }
