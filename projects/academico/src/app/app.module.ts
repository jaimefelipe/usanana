import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from './core/core.module';
import { ConfigModule } from './config/config.module';
import { ContactoModule } from '../../../contacto/src/app/contacto/contacto.module';
import { RegistroModule } from './registro/registro.module';
import { SecurityModule } from '../../../seguridad/src/app/security/security.module';
import { TesoreriaModule } from './tesoreria/tesoreria.module';
import { InventoryModule } from '../../../inventario/src/app/inventory/inventory.module';
import { SalesModule } from '../../../factura/src/app/sales/sales.module';
import { ReceivableModule } from '../../../conta/src/app/receivable/receivable.module';
import { ProfesorModule } from './profesor/profesor.module';
import { AlumnoModule } from './alumno/alumno.module';
import { LmsModule } from './lms/lms.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    ConfigModule,
    ContactoModule,
    RegistroModule,
    SecurityModule,
    TesoreriaModule,
    InventoryModule,
    SalesModule,
    ReceivableModule,
    ProfesorModule,
    AlumnoModule,
    LmsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
