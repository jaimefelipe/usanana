import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardBibliotecaComponent } from './components/dashboard-biblioteca/dashboard-biblioteca.component';
import { CatalogoLibrosComponent } from './components/catalogo-libros/catalogo-libros.component';
import { LibroDetalleComponent } from './components/libro-detalle/libro-detalle.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { UsuariosBibliotecaComponent } from './components/usuarios-biblioteca/usuarios-biblioteca.component';
import { ReportesBibliotecaComponent } from './components/reportes-biblioteca/reportes-biblioteca.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardBibliotecaComponent },
      { path: 'catalogo', component: CatalogoLibrosComponent },
      { path: 'catalogo/:id', component: LibroDetalleComponent },
      { path: 'prestamos', component: PrestamosComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: 'usuarios', component: UsuariosBibliotecaComponent },
      { path: 'reportes', component: ReportesBibliotecaComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecaRoutingModule { }
