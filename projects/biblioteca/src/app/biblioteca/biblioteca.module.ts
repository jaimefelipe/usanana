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
import { BibliotecaLayoutComponent } from './components/biblioteca-layout/biblioteca-layout.component';
import { LibroFormComponent } from './components/libro-form/libro-form.component';
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
import { BibliotecaSearchPipe } from './pipes/biblioteca-search.pipe';

@NgModule({
  declarations: [
    DashboardBibliotecaComponent,
    BibliotecaLayoutComponent,
    OpacLayoutComponent,
    OpacHomeComponent,
    OpacDetalleComponent,
    OpacCuentaComponent,
    OpacRegistroComponent,
    CatalogoLibrosComponent,
    LibroDetalleComponent,
    LibroFormComponent,
    CategoriasComponent,
    EditorialesComponent,
    AutoresComponent,
    TiposMaterialComponent,
    EjemplaresComponent,
    PoliticasPrestamoComponent,
    MultasComponent,
    RolesBibliotecaComponent,
    PermisosBibliotecaComponent,
    RolesPermisosComponent,
    UsuariosRolesComponent,
    SerialesComponent,
    SuscripcionesSerialComponent,
    SerialNumerosComponent,
    SerialRecepcionesComponent,
    TesisComponent,
    MarcRegistrosComponent,
    MarcCamposComponent,
    MarcSubcamposComponent,
    MarcDiccionarioComponent,
    MarcCatalogacionComponent,
    AutoridadesComponent,
    AutoridadCamposComponent,
    AutoridadSubcamposComponent,
    OpacComentariosComponent,
    OpacEtiquetasComponent,
    OpacListasComponent,
    OpacListaItemsComponent,
    OpacHistorialComponent,
    ProveedoresComponent,
    PresupuestosComponent,
    OrdenesCompraComponent,
    OrdenesCompraDetalleComponent,
    FacturasCompraComponent,
    CotizacionesComponent,
    SedesBibliotecaComponent,
    IntegracionesBibliotecaComponent,
    BibliotecaSearchPipe,
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
