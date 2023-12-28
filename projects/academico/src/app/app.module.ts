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
    SecurityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
