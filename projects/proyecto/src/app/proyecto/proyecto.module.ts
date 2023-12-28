import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProyectoRoutingModule } from './proyecto-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

import { jqxTreeModule } from 'jqwidgets-ng/jqxtree';
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';

import { ProyectoComponent } from './proyecto/proyecto.component';
import { ProyTreeComponent } from './proy-tree/proy-tree.component';
import { ProyActividadComponent } from './proy-actividad/proy-actividad.component';

@NgModule({
  declarations: [ProyTreeComponent, ProyectoComponent, ProyActividadComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    ProyectoRoutingModule,
    jqxTreeModule, jqxExpanderModule
  ],
  bootstrap: [ProyTreeComponent]
})
export class ProyectoModule { }
