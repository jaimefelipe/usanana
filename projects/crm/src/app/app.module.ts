import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { CoreModule } from './core/core.module';
import { ContactoModule } from '../../../contacto/src/app/contacto/contacto.module';
import { SecurityModule } from '../../../seguridad/src/app/security/security.module';
import { ProspeccionComponent } from './prospecto/prospeccion/prospeccion.component';
import { TareasComponent } from './tareas/tareas/tareas.component';
import { ClientesComponent } from './clientes/clientes/clientes.component';
import { CobroComponent } from './clientes/cobro/cobro.component';
import { TareasClienteComponent } from './clientes/tareas-cliente/tareas-cliente.component';
import { PresentacionComponent } from './presentacion/presentacion/presentacion.component';
import { MensajesWhatsappComponent } from './prospecto/mensajes-whatsapp/mensajes-whatsapp.component';
import { DatePipe } from '@angular/common';

import { KanbanModule } from '@syncfusion/ej2-angular-kanban';

@NgModule({
  declarations: [
    AppComponent,
    ProspeccionComponent,
    TareasComponent,
    ClientesComponent,
    CobroComponent,
    TareasClienteComponent,
    PresentacionComponent,
    MensajesWhatsappComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    ContactoModule,
    SecurityModule,
    KanbanModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
