import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodoPagoComponent } from './periodo-pago/periodo-pago.component';
import { ConceptoSalarialComponent } from './concepto-salarial/concepto-salarial.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  declarations: [
    PeriodoPagoComponent,
    ConceptoSalarialComponent
  ]
})
export class PlanillaModule { }
