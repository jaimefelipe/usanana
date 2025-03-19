import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { GeneralModule } from './general/general.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SecurityModule } from '../../../seguridad/src/app/security/security.module';
import { ContactoModule } from '../../../contacto/src/app/contacto/contacto.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    GeneralModule,
    NgbModule,
    SecurityModule,
    ContactoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
