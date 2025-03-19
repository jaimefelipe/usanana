import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TareasRoutingModule } from './tareas-routing.module';
import { TareasComponent } from './tareas/tareas.component';
import { ProyectoModule } from '../proyecto/proyecto.module';
import { TareasMainComponent } from './tareas-main/tareas-main.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';

@NgModule({
  imports: [
    CommonModule,
    TareasRoutingModule,
    ProyectoModule,
    FormsModule
  ],
  declarations: [TareasComponent,TareasMainComponent,SeguimientoComponent]
})
export class TareasModule { }
