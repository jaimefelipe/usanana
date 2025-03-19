import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { ContactoModule } from '../../../../contacto/src/app/contacto/contacto.module';
import { EmpleadosComponent } from './empleados/empleados.component';
import { RrhhComponent } from './rrhh/rrhh.component';
import { AccionPersonalComponent } from './accion-personal/accion-personal.component';
import { DepartamentoComponent } from './departamento/departamento.component';
import { PuestoComponent } from './puesto/puesto.component';
import { ProgramacionComponent } from './programacion/programacion.component';

import { LocalidadComponent } from './localidad/localidad.component';
import { RollComponent } from './roll/roll.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ContactoModule,
    NgbModule

  ],
  declarations: [
    EmpleadosComponent,
    RrhhComponent,
    AccionPersonalComponent,
    DepartamentoComponent,
    PuestoComponent,
    LocalidadComponent,
    RollComponent,
    ProgramacionComponent
  ],
  exports:[RrhhComponent]
})
export class EmpleadosModule { }
