import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { SecurityModule } from '../../../seguridad/src/app/security/security.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { PlanillaModule } from './planilla/planilla.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactoModule } from '../../../contacto/src/app/contacto/contacto.module';



@NgModule({
  declarations: [		
    AppComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SecurityModule,
    EmpleadosModule,
    PlanillaModule,
    ContactoModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
