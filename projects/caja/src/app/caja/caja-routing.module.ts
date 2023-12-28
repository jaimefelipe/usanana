import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashierComponent } from './cashier/cashier.component';
import { CashierMovementComponent } from './cashier-movement/cashier-movement.component';
import { CierreCajaComponent } from './cierre-caja/cierre-caja.component';


const routes: Routes = [
  {path : 'cajaventas', component : CashierComponent},
  {path : 'cajamovimiento', component : CashierMovementComponent},
  {path : 'cierrecaja', component : CierreCajaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
