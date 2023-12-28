import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { BanktRoutingModule } from './bank-routing.module';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankMovementComponent } from './bank-movement/bank-movement.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    CurrencyMaskModule,
    BanktRoutingModule
  ],
  declarations: [BankAccountComponent, BankMovementComponent]
})
export class BankModule { }
