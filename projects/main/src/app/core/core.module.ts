import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { CoreRoutingModule } from './core-routing.module';
import { FullComponent } from './layaut/full/full.component';
import { MenuComponent } from './layaut/menu/menu.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ContactoPComponent } from './pages/contactoP/contactoP.component';
import { FacturaComponent } from './pages/facturas/facturas.component';

@NgModule({
  declarations: [
    FullComponent,
    MenuComponent,
    PerfilComponent,
    ProductosComponent,
    ContactoPComponent,
    FacturaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule
  ],
  exports: [
    MenuComponent
  ]
})
export class CoreModule { }
