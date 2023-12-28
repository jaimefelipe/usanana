import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { PayableRoutingModule } from './payable-routing.module';
import { PayableClassificationComponent } from './payable-classification/payable-classification.component';
import { AccountPayableComponent } from './account-payable/account-payable.component';
import { PayableMovementComponent } from './payable-movement/payable-movement.component';
import { PayableDocumentComponent } from './payable-document/payable-document.component';
import { PayableReportComponent } from './payable-report/payable-report.component';


@NgModule({
  imports: [
    CommonModule,
    PayableRoutingModule,
    FormsModule,
    CurrencyMaskModule,
    NgbModule
  ],
  declarations: [PayableClassificationComponent, AccountPayableComponent, PayableMovementComponent, PayableDocumentComponent, PayableReportComponent]
})
export class PayableModule { }
