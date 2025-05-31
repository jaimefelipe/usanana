import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfesorRoutingModule } from './profesor-routing.module';
import { GrupoProfesorComponent } from './grupo-profesor/grupo-profesor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProfesorRoutingModule
  ],
  declarations: [GrupoProfesorComponent]
})
export class ProfesorModule { }
