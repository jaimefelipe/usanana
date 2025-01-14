import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodoPagoComponent } from './periodo-pago/periodo-pago.component';
import { ConceptoSalarialComponent } from './concepto-salarial/concepto-salarial.component';
import { TipoPlanillaComponent } from './tipo-planilla/tipo-planilla.component';
import { ConceptoTipoPlanillaComponent } from './concepto-tipo-planilla/concepto-tipo-planilla.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { EmpleadoTipoPlanillaComponent } from './empleado-tipo-planilla/empleado-tipo-planilla.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  declarations: [
    PeriodoPagoComponent,
    ConceptoSalarialComponent,
    TipoPlanillaComponent,
    ConceptoTipoPlanillaComponent,
    EmpleadoTipoPlanillaComponent
  ]
})
export class PlanillaModule { }
