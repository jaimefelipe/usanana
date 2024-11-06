import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovementInventoryComponent } from './movement-inventory/movement-inventory.component';
import { ReportInventoryComponent } from './report-inventory/report-inventory.component';
import { InventoryMovementDetailComponent } from './inventory-movement-detail/inventory-movement-detail.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { ExistenciasComponent } from './existencias/existencias.component';
import { MovimientoArticuloComponent } from './movimiento-articulo/movimiento-articulo.component';
import { TomaFisicaComponent } from './toma-fisica/toma-fisica.component';

const routes: Routes = [
  {path : 'categorias', component : CategoryComponent},
  {path : 'subcategorias', component : SubCategoryComponent},
  {path : 'articulos', component : ProductComponent},
  {path : 'movinventario', component : MovementInventoryComponent},
  {path : 'invmovdetail', component : InventoryMovementDetailComponent},
  {path : 'repinventario', component : ReportInventoryComponent},
  {path : 'existencias', component : ExistenciasComponent},
  {path : 'movarticulo', component : MovimientoArticuloComponent},
  {path : 'tomafisica', component : TomaFisicaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
