import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from './core/core.module';
import { ItinerarioModule } from './itinerario/itinerario.module';
import { TransportModule } from './transport/transport.module';
import { ToursModule } from './tours/tours.module';
import { LodgeModule } from './lodge/lodge.module';
import { ContactoModule } from '../../../contacto/src/app/contacto/contacto.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    ItinerarioModule,
    TransportModule,
    ToursModule,
    LodgeModule,
    ContactoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
