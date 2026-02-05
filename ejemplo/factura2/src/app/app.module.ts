import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/**
 * Otros Modulos
 */
import { InventoryModule } from '../../../inventario/src/app/inventory/inventory.module';
import { ContactoModule } from '../../../contacto/src/app/contacto/contacto.module';
import { CajaModule } from '../../../caja/src/app/caja/caja.module';
import { GeneralModule } from '../../../main/src/app/general/general.module';
import { SecurityModule } from '../../../seguridad/src/app/security/security.module';
import { ReceivableModule } from '../../../conta/src/app/receivable/receivable.module'; 

/**
 * modulos loclaes
 */
import { CoreModule } from './core/core.module';
import { SalesModule } from './sales/sales.module';
import { PurchasesModule } from './purchases/purchases.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    SalesModule,
    PurchasesModule,
    FormsModule,
    ContactoModule,
    CajaModule,
    GeneralModule,
    SecurityModule,
    InventoryModule,
    ReceivableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
