import { ReceivableDocumentComponent } from './receivable-document/receivable-document.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivableClassificationComponent } from './receivable-classification/receivable-classification.component';
import { AccountReceivableComponent } from './account-receivable/account-receivable.component';
import { ReceivableMovementComponent } from './receivable-movement/receivable-movement.component';
import { ReceivableReportComponent } from './receivable-report/receivable-report.component';


const routes: Routes = [
  {path : 'cxcClasificacion', component : ReceivableClassificationComponent},
  {path : 'cuentacxc', component : AccountReceivableComponent},
  {path : 'movimientocxc', component : ReceivableMovementComponent},
  {path : 'documentocxc', component: ReceivableDocumentComponent},
  {path : 'reportecxc', component: ReceivableReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceivableRoutingModule { }
