import { PayableDocumentComponent } from './payable-document/payable-document.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayableClassificationComponent } from './payable-classification/payable-classification.component';
import { AccountPayableComponent } from './account-payable/account-payable.component';
import { PayableMovementComponent } from './payable-movement/payable-movement.component';
import { PayableReportComponent } from './payable-report/payable-report.component';


const routes: Routes = [
  {path : 'cxpClasificacion', component : PayableClassificationComponent},
  {path : 'cuentacxp', component : AccountPayableComponent},
  {path : 'movimientocxp', component : PayableMovementComponent},
  {path : 'documentocxp', component: PayableDocumentComponent},
  {path : 'reportecxp', component: PayableReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayableRoutingModule { }
