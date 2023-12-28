import { PaqueteComponent } from './paquete/paquete.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './layaut/menu/menu.component';
import { PlaceComponent } from './place/place.component';
import { CoordinateComponent } from './coordinate/coordinate.component';

@NgModule({
  declarations: [MenuComponent,PlaceComponent,CoordinateComponent,PaqueteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule,

  ],
  exports: [
    MenuComponent
  ]
})
export class CoreModule { }
