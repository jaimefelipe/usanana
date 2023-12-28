import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToursRoutingModule } from './tours-routing.module';
import { TourComponent } from './tour/tour.component';
import { TarifaTourComponent } from './tarifa-tour/tarifa-tour.component';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ToursRoutingModule
  ],
  declarations: [TourComponent,TarifaTourComponent]
})
export class ToursModule { }
