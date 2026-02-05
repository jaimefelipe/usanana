import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SalesRoutingModule } from './sales-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReportComponent } from './report/report.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { ProductoClienteComponent } from './producto-cliente/producto-cliente.component';
import { InvoiceChargeComponent } from './invoice-charge/invoice-charge.component';

@NgModule({
  declarations: [InvoiceComponent, ReportComponent,ProductoClienteComponent,InvoiceChargeComponent],
  imports: [
    CommonModule,
    NgbModule,
    SalesRoutingModule,
    FormsModule,
    CurrencyMaskModule
  ]
})
export class SalesModule { }
