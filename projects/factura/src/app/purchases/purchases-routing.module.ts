import { ReportPurchaseComponent } from './report-purchase/report-purchase.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path : 'purchaseInvoice', component : PurchaseInvoiceComponent},
  {path : 'reportPurchase', component : ReportPurchaseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
