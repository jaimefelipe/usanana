import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";


import { ReceivableRoutingModule } from './receivable-routing.module';
import { ReceivableClassificationComponent } from './receivable-classification/receivable-classification.component';
import { AccountReceivableComponent } from './account-receivable/account-receivable.component';
import { ReceivableMovementComponent } from './receivable-movement/receivable-movement.component';
import { ReceivableDocumentComponent } from './receivable-document/receivable-document.component';
import { ReceivableReportComponent } from './receivable-report/receivable-report.component';


@NgModule({
  declarations: [ReceivableClassificationComponent, AccountReceivableComponent, ReceivableMovementComponent, ReceivableDocumentComponent, ReceivableReportComponent],
  imports: [
    CommonModule,
    ReceivableRoutingModule,
    FormsModule,
    CurrencyMaskModule,
    NgbModule
  ]
})
export class ReceivableModule { }
