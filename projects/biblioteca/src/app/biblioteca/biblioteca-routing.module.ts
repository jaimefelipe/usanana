import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardBibliotecaComponent } from './components/dashboard-biblioteca/dashboard-biblioteca.component';
import { CatalogoLibrosComponent } from './components/catalogo-libros/catalogo-libros.component';
import { LibroDetalleComponent } from './components/libro-detalle/libro-detalle.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { UsuariosBibliotecaComponent } from './components/usuarios-biblioteca/usuarios-biblioteca.component';
import { ReportesBibliotecaComponent } from './components/reportes-biblioteca/reportes-biblioteca.component';
import { BibliotecaLayoutComponent } from './components/biblioteca-layout/biblioteca-layout.component';
import { OpacLayoutComponent } from './components/opac-layout/opac-layout.component';
import { OpacHomeComponent } from './components/opac-home/opac-home.component';
import { OpacDetalleComponent } from './components/opac-detalle/opac-detalle.component';
import { OpacCuentaComponent } from './components/opac-cuenta/opac-cuenta.component';
import { OpacRegistroComponent } from './components/opac-registro/opac-registro.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { EditorialesComponent } from './components/editoriales/editoriales.component';
import { AutoresComponent } from './components/autores/autores.component';
import { TiposMaterialComponent } from './components/tipos-material/tipos-material.component';
import { EjemplaresComponent } from './components/ejemplares/ejemplares.component';
import { PoliticasPrestamoComponent } from './components/politicas-prestamo/politicas-prestamo.component';
import { MultasComponent } from './components/multas/multas.component';
import { RolesBibliotecaComponent } from './components/roles-biblioteca/roles-biblioteca.component';
import { PermisosBibliotecaComponent } from './components/permisos-biblioteca/permisos-biblioteca.component';
import { RolesPermisosComponent } from './components/roles-permisos/roles-permisos.component';
import { UsuariosRolesComponent } from './components/usuarios-roles/usuarios-roles.component';
import { SerialesComponent } from './components/seriales/seriales.component';
import { SuscripcionesSerialComponent } from './components/suscripciones-serial/suscripciones-serial.component';
import { SerialNumerosComponent } from './components/serial-numeros/serial-numeros.component';
import { SerialRecepcionesComponent } from './components/serial-recepciones/serial-recepciones.component';
import { TesisComponent } from './components/tesis/tesis.component';
import { MarcRegistrosComponent } from './components/marc-registros/marc-registros.component';
import { MarcCamposComponent } from './components/marc-campos/marc-campos.component';
import { MarcSubcamposComponent } from './components/marc-subcampos/marc-subcampos.component';
import { MarcDiccionarioComponent } from './components/marc-diccionario/marc-diccionario.component';
import { MarcCatalogacionComponent } from './components/marc-catalogacion/marc-catalogacion.component';
import { AutoridadesComponent } from './components/autoridades/autoridades.component';
import { AutoridadCamposComponent } from './components/autoridad-campos/autoridad-campos.component';
import { AutoridadSubcamposComponent } from './components/autoridad-subcampos/autoridad-subcampos.component';
import { OpacComentariosComponent } from './components/opac-comentarios/opac-comentarios.component';
import { OpacEtiquetasComponent } from './components/opac-etiquetas/opac-etiquetas.component';
import { OpacListasComponent } from './components/opac-listas/opac-listas.component';
import { OpacListaItemsComponent } from './components/opac-lista-items/opac-lista-items.component';
import { OpacHistorialComponent } from './components/opac-historial/opac-historial.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { PresupuestosComponent } from './components/presupuestos/presupuestos.component';
import { OrdenesCompraComponent } from './components/ordenes-compra/ordenes-compra.component';
import { OrdenesCompraDetalleComponent } from './components/ordenes-compra-detalle/ordenes-compra-detalle.component';
import { FacturasCompraComponent } from './components/facturas-compra/facturas-compra.component';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { SedesBibliotecaComponent } from './components/sedes-biblioteca/sedes-biblioteca.component';
import { IntegracionesBibliotecaComponent } from './components/integraciones-biblioteca/integraciones-biblioteca.component';
import { BibliotecaAuthGuard } from './guards/biblioteca-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BibliotecaLayoutComponent,
    canActivate: [BibliotecaAuthGuard],
    canActivateChild: [BibliotecaAuthGuard],
    children: [
      { path: '', component: DashboardBibliotecaComponent },
      { path: 'catalogo', component: CatalogoLibrosComponent },
      { path: 'catalogo/nuevo', component: CatalogoLibrosComponent },
      { path: 'catalogo/:id/editar', component: CatalogoLibrosComponent },
      { path: 'catalogo/:id', component: LibroDetalleComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'editoriales', component: EditorialesComponent },
      { path: 'autores', component: AutoresComponent },
      { path: 'tipos-material', component: TiposMaterialComponent },
      { path: 'ejemplares', component: EjemplaresComponent },
      { path: 'tesis', component: TesisComponent },
      { path: 'marc-registros', component: MarcRegistrosComponent },
      { path: 'marc-campos', component: MarcCamposComponent },
      { path: 'marc-subcampos', component: MarcSubcamposComponent },
      { path: 'marc-diccionario', component: MarcDiccionarioComponent },
      { path: 'marc-catalogacion', component: MarcCatalogacionComponent },
      { path: 'autoridades', component: AutoridadesComponent },
      { path: 'autoridad-campos', component: AutoridadCamposComponent },
      { path: 'autoridad-subcampos', component: AutoridadSubcamposComponent },
      { path: 'prestamos', component: PrestamosComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: 'politicas-prestamo', component: PoliticasPrestamoComponent },
      { path: 'multas', component: MultasComponent },
      { path: 'usuarios', component: UsuariosBibliotecaComponent },
      { path: 'roles', component: RolesBibliotecaComponent },
      { path: 'permisos', component: PermisosBibliotecaComponent },
      { path: 'roles-permisos', component: RolesPermisosComponent },
      { path: 'usuarios-roles', component: UsuariosRolesComponent },
      { path: 'seriales', component: SerialesComponent },
      { path: 'suscripciones', component: SuscripcionesSerialComponent },
      { path: 'serial-numeros', component: SerialNumerosComponent },
      { path: 'serial-recepciones', component: SerialRecepcionesComponent },
      { path: 'opac-comentarios', component: OpacComentariosComponent },
      { path: 'opac-etiquetas', component: OpacEtiquetasComponent },
      { path: 'opac-listas', component: OpacListasComponent },
      { path: 'opac-lista-items', component: OpacListaItemsComponent },
      { path: 'opac-historial', component: OpacHistorialComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'presupuestos', component: PresupuestosComponent },
      { path: 'ordenes-compra', component: OrdenesCompraComponent },
      { path: 'ordenes-compra-detalle', component: OrdenesCompraDetalleComponent },
      { path: 'facturas-compra', component: FacturasCompraComponent },
      { path: 'cotizaciones', component: CotizacionesComponent },
      { path: 'sedes', component: SedesBibliotecaComponent },
      { path: 'integraciones', component: IntegracionesBibliotecaComponent },
      { path: 'reportes', component: ReportesBibliotecaComponent }
    ]
  },
  {
    path: 'opac',
    component: OpacLayoutComponent,
    children: [
      { path: '', component: OpacHomeComponent },
      { path: 'catalogo/:id', component: OpacDetalleComponent },
      { path: 'mi-cuenta', component: OpacCuentaComponent },
      { path: 'registro', component: OpacRegistroComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecaRoutingModule { }
