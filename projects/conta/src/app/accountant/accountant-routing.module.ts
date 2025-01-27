import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountantReportComponent } from './accountant-report/accountant-report.component';
import { PeriodoContableComponent } from './periodo-contable/periodo-contable.component';
import { AsientoDiarioComponent } from './asiento-diario/asiento-diario.component';
import { CentroCostoComponent } from './centro-costo/centro-costo.component';
import { CatalogoContableComponent } from './catalogo-contable/catalogo-contable.component';
import { CatalogoTreeComponent } from './catalogo-tree/catalogo-tree.component';


const routes: Routes = [
  {path : 'cgeperiodo', component : PeriodoContableComponent},
  {path : 'cgeasiento', component : AsientoDiarioComponent},
  {path : 'cgereport', component : AccountantReportComponent},
  {path : 'cgecentrocosto', component : CentroCostoComponent},
  {path : 'cgecatalogotree', component : CatalogoTreeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountantRoutingModule { }
