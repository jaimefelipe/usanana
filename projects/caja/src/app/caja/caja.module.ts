import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CajaRoutingModule } from './caja-routing.module';
import { CurrencyPipe} from '@angular/common';

import { CashierComponent } from './cashier/cashier.component';
import { CashierMovementComponent } from './cashier-movement/cashier-movement.component';
import { CierreCajaComponent } from './cierre-caja/cierre-caja.component';


@NgModule({
  declarations: [
    CashierComponent, CashierMovementComponent, CierreCajaComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    CajaRoutingModule,
    CurrencyMaskModule
  ],
  providers : [CurrencyPipe],
  exports: [
    CashierComponent,
    CurrencyMaskModule
  ]
})
export class CajaModule { }
