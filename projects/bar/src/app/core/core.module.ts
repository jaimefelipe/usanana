import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './layaut/menu/menu.component';
import { MenuSuperiorComponent } from './layaut/menu-superior/menu-superior.component';
import { ResTablaDinamicaComponent } from './layaut/res-tabla-dinamica/res-tabla-dinamica.component';
import { FullComponent } from './layaut/full/full.component';
import { PivotViewModule } from '@syncfusion/ej2-angular-pivotview';

@NgModule({
  declarations: [MenuComponent,MenuSuperiorComponent,ResTablaDinamicaComponent,FullComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule,
    PivotViewModule
  ],
  exports: [
    MenuComponent,
    MenuSuperiorComponent
  ]
})
export class CoreModule { }
