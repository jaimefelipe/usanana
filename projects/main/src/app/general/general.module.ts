import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralRoutingModule } from './general-routing.module';
import { BranchComponent } from './branch/branch.component';
import { PeopleComponent } from './people/people.component';
import { ParametrosCiaComponent } from './parametros-cia/parametros-cia.component';
import { CompanyComponent } from './company/company.component';
import { FacturaComponentC } from './facturaC/facturaC.component';
import { LicenciaComponent } from './licencia/licencia.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConsecutivoComponent } from './consecutivo/consecutivo.component';

@NgModule({
  declarations: [LicenciaComponent,BranchComponent, FacturaComponentC,PeopleComponent, ParametrosCiaComponent, CompanyComponent, ConsecutivoComponent],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    FormsModule,
    NgbModule,
  ],
  exports : [
    FacturaComponentC
  ]
})
export class GeneralModule { }
