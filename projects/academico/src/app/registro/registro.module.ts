import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeriodoAcademicoComponent } from './periodo-academico/periodo-academico.component';
import { RegistroRoutingModule } from './registro-routing.module';
import { GrupoAcademicoComponent } from './grupo-academico/grupo-academico.component';
import { MatriculaComponent } from './matricula/matricula.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RegistroRoutingModule
  ],
  declarations: [PeriodoAcademicoComponent,GrupoAcademicoComponent,MatriculaComponent]
})
export class RegistroModule { }
