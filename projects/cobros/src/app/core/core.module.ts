import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './layaut/menu/menu.component';
import { FacturarComponent } from './layaut/facturar/facturar.component';
import { TransaccionesComponent } from './layaut/transacciones/transacciones.component';
import { FullComponent } from './layaut/full/full.component';

@NgModule({
  declarations: [MenuComponent,FacturarComponent,TransaccionesComponent,FullComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule,
    BrowserModule
  ],
  exports: [
    MenuComponent
  ]
})
export class CoreModule { }
