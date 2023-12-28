import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { ReportComponent } from './report/report.component';
//import { CashierComponent } from '../../../../caja/src/app/caja/cashier/cashier.component';
//import { CashierMovementComponent } from '../../../../caja/src/app/caja/cashier-movement/cashier-movement.component';
//import { PeopleComponent } from 'projects/contacto/src/app/contacto/contacto/contacto.component';
import { ProductoClienteComponent } from './producto-cliente/producto-cliente.component';
import { InvoiceChargeComponent } from './invoice-charge/invoice-charge.component';
//import { FacturaComponentC } from '../../../../main/src/app/general/facturaC/facturaC.component';

const routes: Routes = [
  {path : 'ventas', component : InvoiceComponent},
  {path : 'reporteventas', component : ReportComponent},
  //{path : 'cajaventas', component : CashierComponent},
  //{path : 'cajamovimiento', component : CashierMovementComponent},
  //{path : 'people', component : PeopleComponent},
  {path : 'prodcliente', component : ProductoClienteComponent},
  {path : 'cargoventa', component : InvoiceChargeComponent},
  //{path : 'facturaerror', component : FacturaComponentC},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
