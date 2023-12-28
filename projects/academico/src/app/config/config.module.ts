import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { ConfigRoutingModule } from './config-routing.module';
import { CarreraComponent } from './carrera/carrera.component';
import { CursoComponent } from './curso/curso.component';


@NgModule({
  declarations: [
    CarreraComponent,
    CursoComponent
  ],
  imports: [
    FormsModule,
    CurrencyMaskModule,
    NgbModule,
    CommonModule,
    ConfigRoutingModule
  ]
})
export class ConfigModule { }
