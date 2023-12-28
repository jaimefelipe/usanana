import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { ReportPurchaseComponent } from './report-purchase/report-purchase.component';


@NgModule({
  declarations: [PurchaseInvoiceComponent, ReportPurchaseComponent],
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    NgbModule,
    FormsModule
  ]
})
export class PurchasesModule { }
