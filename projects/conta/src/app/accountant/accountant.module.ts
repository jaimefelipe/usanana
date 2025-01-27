//import { CatalogoTreeComponent } from './catalogo-tree/catalogo-tree.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { AccountantRoutingModule } from './accountant-routing.module';
import { AccountantReportComponent } from './accountant-report/accountant-report.component';
import { CatalogoContableComponent } from './catalogo-contable/catalogo-contable.component';
import { PeriodoContableComponent } from './periodo-contable/periodo-contable.component';
import { AsientoDiarioComponent } from './asiento-diario/asiento-diario.component';

import { CatalogoTreeComponent } from './catalogo-tree/catalogo-tree.component';
import { CentroCostoComponent } from './centro-costo/centro-costo.component';


import { TreeViewComponent } from './tree-view/tree-view.component';

@NgModule({
  declarations: [CatalogoContableComponent,AccountantReportComponent, PeriodoContableComponent, AsientoDiarioComponent, CentroCostoComponent,CatalogoTreeComponent,TreeViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    CurrencyMaskModule,
    AccountantRoutingModule
  ]
})
export class AccountantModule { }
