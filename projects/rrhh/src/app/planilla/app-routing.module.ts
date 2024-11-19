import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeriodoPagoComponent } from './periodo-pago/periodo-pago.component';
import { ConceptoSalarialComponent } from './concepto-salarial/concepto-salarial.component';
import { TipoPlanillaComponent } from './tipo-planilla/tipo-planilla.component';
import { ConceptoTipoPlanillaComponent } from './concepto-tipo-planilla/concepto-tipo-planilla.component';

const routes: Routes = [
    {path : 'periodopago', component : PeriodoPagoComponent},
    {path : 'conceptosalarial', component : ConceptoSalarialComponent},
    {path : 'tipoplanilla', component : TipoPlanillaComponent},
    {path : 'conceptoplanilla', component : ConceptoTipoPlanillaComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
