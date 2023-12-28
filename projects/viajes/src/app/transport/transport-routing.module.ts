import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteComponent } from './route/route.component';
import { RouteRateComponent } from './route-rate/route-rate.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { VehicleCategoryComponent } from './vehicle-category/vehicle-category.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { VehicleComponent } from './vehicle/vehicle.component';

const routes: Routes = [
  { path: 'routes', component: RouteComponent },
  { path: 'routesrate', component: RouteRateComponent },
  { path: 'routeschedule', component: ScheduleComponent },
  { path: 'vehiclecat', component: VehicleCategoryComponent },
  { path: 'vehicletype', component: VehicleTypeComponent },
  { path: 'vehicle', component: VehicleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TransportRoutingModule { }
