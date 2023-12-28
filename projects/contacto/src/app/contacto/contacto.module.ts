import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactoRoutingModule } from './contacto-routing.module';
import { ContactoComponent } from './contacto/contacto.component';
import { MarcasComponent } from './marcas/marcas.component';
import { GeneralComponent } from './general/general.component';
import { DireccionComponent } from './direccion/direccion.component';
import { VentaComponent } from './venta/venta.component';
import { ContactosComponent } from './contactos/contactos.component';
import { NotasComponent } from './notas/notas.component';

@NgModule({
  exports: [GeneralComponent,DireccionComponent,VentaComponent,ContactosComponent,NotasComponent],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    ContactoRoutingModule
  ],
  declarations: [ContactoComponent,MarcasComponent, GeneralComponent, DireccionComponent, VentaComponent, ContactosComponent, NotasComponent]
})
export class ContactoModule { }
