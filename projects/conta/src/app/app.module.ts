import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './core/core.module';

import { AccountantModule } from './accountant/accountant.module';
import { InventoryModule } from '../../../inventario/src/app/inventory/inventory.module';
import { ContactoModule } from '../../../contacto/src/app/contacto/contacto.module';
import { CajaModule } from '../../../caja/src/app/caja/caja.module';
import { SalesModule } from '../../../factura/src/app/sales/sales.module';
import { PurchasesModule } from '../../../factura/src/app/purchases/purchases.module';
import { GeneralModule } from '../../../main/src/app/general/general.module';
import { SecurityModule } from '../../../seguridad/src/app/security/security.module';
import { ReceivableModule } from './receivable/receivable.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    InventoryModule,
    ContactoModule,
    CajaModule,
    SalesModule,
    PurchasesModule,
    GeneralModule,
    SecurityModule,
    ReceivableModule,
    AccountantModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
