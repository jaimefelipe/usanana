import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TesoreriaRoutingModule } from './tesoreria-routing.module';
import { CobroAcademicoComponent } from './cobro-academico/cobro-academico.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TesoreriaRoutingModule
  ],
  declarations: [CobroAcademicoComponent]
})
export class TesoreriaModule { }
