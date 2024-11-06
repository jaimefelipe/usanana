import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeriodoPagoComponent } from './periodo-pago/periodo-pago.component';
import { ConceptoSalarialComponent } from './concepto-salarial/concepto-salarial.component';

const routes: Routes = [
    {path : 'periodopago', component : PeriodoPagoComponent},
    {path : 'conceptosalarial', component : ConceptoSalarialComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
