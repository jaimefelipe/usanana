import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from './core/core.module';
import { CajaModule } from '../../../caja/src/app/caja/caja.module';
import { SalesModule } from '../../../factura/src/app/sales/sales.module';
import { PurchasesModule } from '../../../factura/src/app/purchases/purchases.module';
import { SecurityModule } from '../../../seguridad/src/app/security/security.module';
import { InventoryModule } from '../../../inventario/src/app/inventory/inventory.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    CajaModule,
    SalesModule,
    PurchasesModule,
    SecurityModule,
    InventoryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
