import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { CoreModule } from './core/core.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { InventoryModule } from '../../../inventario/src/app/inventory/inventory.module';
import { ContactoModule } from '../../../contacto/src/app/contacto/contacto.module';
import { CajaModule } from '../../../caja/src/app/caja/caja.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SecurityModule } from '../../../seguridad/src/app/security/security.module';
import { ReceivableModule } from '../../../conta/src/app/receivable/receivable.module';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    RestaurantModule,
    InventoryModule,
    ContactoModule,
    CajaModule,
    NgbModule,
    SecurityModule,
    CurrencyMaskModule,
    ReceivableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
