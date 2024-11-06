import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InventoryRoutingModule } from './inventory-routing.module';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { MovementInventoryComponent } from './movement-inventory/movement-inventory.component';
import { ReportInventoryComponent } from './report-inventory/report-inventory.component';
import { InventoryMovementDetailComponent } from './inventory-movement-detail/inventory-movement-detail.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { ExistenciasComponent } from './existencias/existencias.component';
import { MovimientoArticuloComponent } from './movimiento-articulo/movimiento-articulo.component';
import { TomaFisicaComponent } from './toma-fisica/toma-fisica.component';


@NgModule({
  declarations: [CategoryComponent, ProductComponent, MovementInventoryComponent, ReportInventoryComponent, InventoryMovementDetailComponent, SubCategoryComponent, ExistenciasComponent, MovimientoArticuloComponent,TomaFisicaComponent],
  imports: [
    CommonModule,
    NgbModule,
    InventoryRoutingModule,
    FormsModule,
  ]
})
export class InventoryModule { }
