import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BibliotecaRoutingModule } from './biblioteca-routing.module';
import { DashboardBibliotecaComponent } from './components/dashboard-biblioteca/dashboard-biblioteca.component';
import { CatalogoLibrosComponent } from './components/catalogo-libros/catalogo-libros.component';
import { LibroDetalleComponent } from './components/libro-detalle/libro-detalle.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { UsuariosBibliotecaComponent } from './components/usuarios-biblioteca/usuarios-biblioteca.component';
import { ReportesBibliotecaComponent } from './components/reportes-biblioteca/reportes-biblioteca.component';

@NgModule({
  declarations: [
    DashboardBibliotecaComponent,
    CatalogoLibrosComponent,
    LibroDetalleComponent,
    PrestamosComponent,
    ReservasComponent,
    UsuariosBibliotecaComponent,
    ReportesBibliotecaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BibliotecaRoutingModule
  ]
})
export class BibliotecaModule { }
