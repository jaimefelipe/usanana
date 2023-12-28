import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankMovementComponent } from './bank-movement/bank-movement.component';
const routes: Routes = [
  {path : 'cuentasbk', component : BankAccountComponent},
  {path : 'movimientobk', component : BankMovementComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanktRoutingModule { }
