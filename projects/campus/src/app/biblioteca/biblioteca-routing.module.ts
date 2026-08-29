import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { LibroDetalleComponent } from './libro-detalle/libro-detalle.component';
import { MiBibliotecaComponent } from './mi-biblioteca/mi-biblioteca.component';

const routes: Routes = [
  { path: 'biblioteca', component: CatalogoComponent },
  { path: 'biblioteca/libro', component: LibroDetalleComponent },
  { path: 'biblioteca/mi-cuenta', component: MiBibliotecaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecaRoutingModule { }
