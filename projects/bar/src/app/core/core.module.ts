import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './layaut/menu/menu.component';
import { MenuSuperiorComponent } from './layaut/menu-superior/menu-superior.component';
import { ResTablaDinamicaComponent } from './layaut/res-tabla-dinamica/res-tabla-dinamica.component';
import { FullComponent } from './layaut/full/full.component';
import { PivotViewModule } from '@syncfusion/ej2-angular-pivotview';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { CategoryService, ColumnSeriesService, LegendService, TooltipService } from '@syncfusion/ej2-angular-charts';


@NgModule({
  declarations: [MenuComponent,MenuSuperiorComponent,ResTablaDinamicaComponent,FullComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreRoutingModule,
    PivotViewModule,
    SplitterModule,
    GridModule,
    ChartModule
  ],
  exports: [
    MenuComponent,
    MenuSuperiorComponent
  ],
  providers: [
    CategoryService,
    ColumnSeriesService,
    LegendService,
    TooltipService
  ]
})
export class CoreModule { }
