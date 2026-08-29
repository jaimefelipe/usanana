import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BibliotecaRoutingModule } from './biblioteca-routing.module';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { LibroDetalleComponent } from './libro-detalle/libro-detalle.component';
import { MiBibliotecaComponent } from './mi-biblioteca/mi-biblioteca.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BibliotecaRoutingModule
  ],
  declarations: [
    CatalogoComponent,
    LibroDetalleComponent,
    MiBibliotecaComponent
  ]
})
export class BibliotecaModule { }
