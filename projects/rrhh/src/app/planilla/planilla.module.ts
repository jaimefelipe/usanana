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
import { PlReportesComponent } from './pl-reportes/pl-reportes.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { PlanillaGeneralComponent } from './planilla-general/planilla-general.component';
import { MovimientosPlanillaComponent } from './movimientos-planilla/movimientos-planilla.component';
import { MarcasErroneasComponent } from './marcas-erroneas/marcas-erroneas.component';
import { CalculoPlanillaComponent } from './calculo-planilla/calculo-planilla.component';

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
    EmpleadoTipoPlanillaComponent,
    PlReportesComponent,
    PlanillaComponent,
    PlanillaGeneralComponent,
    MovimientosPlanillaComponent,
    MarcasErroneasComponent,
    CalculoPlanillaComponent
  ]
})
export class PlanillaModule { }
