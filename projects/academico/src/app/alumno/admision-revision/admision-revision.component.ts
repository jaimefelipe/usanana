import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdmisionRevisionService } from './admision-revision.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admision-revision',
  templateUrl: './admision-revision.component.html',
  styleUrls: ['./admision-revision.component.css']
})
export class AdmisionRevisionComponent implements OnInit {
  paginacion = { FirstRow: 1, LastRow: 50 };
  searchField = '';
  estadoFiltro = '';
  Solicitudes: any[] = [];
  Solicitud: any = null;
  Documentos: any[] = [];
  OrdenesPago: any[] = [];
  Bitacora: any[] = [];
  Planes: any[] = [];
  PlanSeleccionado: any = null;
  MontoOrden = 0;
  CalculoPago: any = null;
  ConfigFinanciera: any = null;
  PlanEstudios: any[] = [];
  BancosTexto = '';
  Cargando = false;
  MensajeListado = '';
  edit = false;

  constructor(private admisionService: AdmisionRevisionService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    const idEmpresa = localStorage.getItem('Id_Empresa');
    if (!idEmpresa || !/^\d+$/.test(idEmpresa)) {
      localStorage.setItem('Id_Empresa', '1');
    }
    this.cargarSolicitudes();
    this.cargarPlanesPago();
  }

  async cargarSolicitudes() {
    this.Cargando = true;
    this.MensajeListado = '';
    try {
      const data = await this.admisionService.cargarSolicitudes(this.paginacion, this.searchField, this.estadoFiltro);
      this.Solicitudes = data && data.data ? data.data : [];
      if (!this.Solicitudes.length) {
        this.MensajeListado = 'No hay solicitudes para los filtros seleccionados.';
      }
    } catch (error) {
      console.error('Error cargando admisiones', error);
      this.Solicitudes = [];
      this.MensajeListado = 'No se pudo cargar el listado de admisiones. Revise la conexion o el API.';
    } finally {
      this.Cargando = false;
    }
  }

  async cargarPlanesPago() {
    const data = await this.admisionService.cargarPlanesPago();
    this.Planes = data && data.data ? data.data : [];
    this.PlanSeleccionado = this.Planes.length ? this.Planes[0] : null;
  }

  async abrirExpediente(solicitud: any) {
    await this.seleccionar(solicitud);
    this.edit = true;
  }

  cancel() {
    this.edit = false;
    this.Solicitud = null;
    this.Documentos = [];
    this.OrdenesPago = [];
    this.Bitacora = [];
    this.CalculoPago = null;
    this.ConfigFinanciera = null;
    this.PlanEstudios = [];
    this.BancosTexto = '';
  }

  async seleccionar(solicitud: any) {
    const data = await this.admisionService.cargarSolicitud(solicitud.Id_Admision_Solicitud);
    this.Solicitud = data && data.data && data.data.length ? data.data[0] : solicitud;
    this.CalculoPago = this.parseJson(this.Solicitud.Calculo_Pago_JSON);
    this.Solicitud.Moneda = this.CalculoPago && this.CalculoPago.moneda ? this.CalculoPago.moneda : 'CRC';
    this.MontoOrden = Number(this.Solicitud.Monto_Base_Estimado || (this.CalculoPago ? this.CalculoPago.monto_base : 0) || 0);
    if (this.Solicitud.Id_Admision_Plan_Pago && this.Planes.length) {
      this.PlanSeleccionado = this.Planes.find(p => String(p.Id_Admision_Plan_Pago) === String(this.Solicitud.Id_Admision_Plan_Pago)) || this.PlanSeleccionado;
    }
    await this.cargarConfigYPlan();
    const docs = await this.admisionService.cargarDocumentos(solicitud.Id_Admision_Solicitud);
    this.Documentos = docs && docs.data ? docs.data.map((doc: any) => {
      const url = this.urlDocumento(doc.URL);
      return {
        ...doc,
        Url_Publica: url,
        Url_Segura: url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null,
        Es_Imagen: this.esImagen(url, doc.Mime_Type || doc.Nombre_Archivo),
        Es_Pdf: this.esPdf(url, doc.Mime_Type || doc.Nombre_Archivo)
      };
    }) : [];

    const ordenes = await this.admisionService.cargarOrdenesPago(solicitud.Id_Admision_Solicitud);
    this.OrdenesPago = ordenes && ordenes.data ? ordenes.data.map((orden: any) => ({
      ...orden,
      Comprobante_Publico: this.urlDocumento(orden.Comprobante_URL)
    })) : [];

    const bitacora = await this.admisionService.cargarBitacora(solicitud.Id_Admision_Solicitud);
    this.Bitacora = bitacora && bitacora.data ? bitacora.data : [];
  }

  parseJson(value: any): any {
    try {
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return null;
    }
  }

  async cargarConfigYPlan() {
    if (!this.Solicitud) {
      return;
    }
    const configData = await this.admisionService.cargarConfigFinanciera(this.Solicitud);
    const configRows = configData && configData.data ? configData.data : [];
    this.ConfigFinanciera = configRows.length ? configRows[0] : {
      Id_Config_Financiera: '',
      Id_Carrera: this.Solicitud.Id_Carrera,
      Nivel: this.Solicitud.Nivel,
      Nombre: 'Configuracion admision ' + (this.Solicitud.Carrera || ''),
      Moneda: 'CRC',
      Cursos_Por_Bloque: 4,
      Creditos_Por_Curso: 3,
      Precio_Credito: 0,
      Precio_Curso: 0,
      Matricula_Bloque: 0,
      Medio_Pago_Texto: 'Realice el pago por transferencia o deposito y cargue el comprobante en el portal de seguimiento.',
      Bancos_JSON: JSON.stringify([{ banco: 'Configurar banco', cuenta: '', iban: '', moneda: 'CRC', titular: 'Universidad Santa Ana San Jose' }]),
      Notificar_Email: 'admisiones@usantana.com',
      Activo: 1
    };
    this.BancosTexto = this.formatearBancosTexto(this.ConfigFinanciera.Bancos_JSON);
    const planData = await this.admisionService.cargarPlanEstudios(this.Solicitud.Id_Carrera);
    this.PlanEstudios = planData && planData.data ? planData.data : [];
    this.recalcularPago();
  }

  formatearBancosTexto(json: any): string {
    const bancos = this.parseJson(json) || [];
    if (!Array.isArray(bancos) || !bancos.length) {
      return '';
    }
    return bancos.map((b: any) => [b.banco, b.cuenta, b.iban, b.moneda, b.titular].filter(Boolean).join(' | ')).join('\n');
  }

  bancosTextoAJson(): string {
    const bancos = String(this.BancosTexto || '').split(/\r?\n/).map(linea => {
      const partes = linea.split('|').map(x => x.trim());
      return {
        banco: partes[0] || '',
        cuenta: partes[1] || '',
        iban: partes[2] || '',
        moneda: partes[3] || (this.ConfigFinanciera.Moneda || 'CRC'),
        titular: partes[4] || 'Universidad Santa Ana San Jose'
      };
    }).filter(b => b.banco || b.cuenta || b.iban);
    return JSON.stringify(bancos);
  }

  recalcularPago() {
    if (!this.ConfigFinanciera || !this.PlanSeleccionado) {
      return;
    }
    const cursos = Math.max(1, Number(this.ConfigFinanciera.Cursos_Por_Bloque || 4));
    const creditosPorCurso = Math.max(0, Number(this.ConfigFinanciera.Creditos_Por_Curso || 3));
    const precioCredito = Math.max(0, Number(this.ConfigFinanciera.Precio_Credito || 0));
    const precioCurso = Math.max(0, Number(this.ConfigFinanciera.Precio_Curso || 0));
    const matricula = Math.max(0, Number(this.ConfigFinanciera.Matricula_Bloque || 0));
    const subtotalCursos = precioCurso > 0 ? precioCurso * cursos : precioCredito * creditosPorCurso * cursos;
    const base = matricula + subtotalCursos;
    const descuento = base * (Number(this.PlanSeleccionado.Descuento_Porcentaje || 0) / 100);
    const interes = (base - descuento) * (Number(this.PlanSeleccionado.Interes_Porcentaje || 0) / 100);
    const total = Math.max(0, base - descuento + interes);
    const cuotas = Math.max(1, Number(this.PlanSeleccionado.Numero_Cuotas || 1));
    this.CalculoPago = {
      moneda: this.ConfigFinanciera.Moneda || 'CRC',
      cursos_por_bloque: cursos,
      creditos_por_curso: creditosPorCurso,
      precio_credito: precioCredito,
      precio_curso: precioCurso,
      matricula_bloque: matricula,
      subtotal_cursos: subtotalCursos,
      monto_base: base,
      descuento_porcentaje: Number(this.PlanSeleccionado.Descuento_Porcentaje || 0),
      descuento,
      interes_porcentaje: Number(this.PlanSeleccionado.Interes_Porcentaje || 0),
      interes,
      total,
      numero_cuotas: cuotas,
      cuota_monto: total / cuotas
    };
    this.MontoOrden = base;
    this.Solicitud.Moneda = this.CalculoPago.moneda;
  }

  pagoInfoActual(): any {
    return {
      medio_pago_texto: this.ConfigFinanciera ? this.ConfigFinanciera.Medio_Pago_Texto || '' : '',
      notificar_email: this.ConfigFinanciera ? this.ConfigFinanciera.Notificar_Email || '' : '',
      bancos: this.parseJson(this.ConfigFinanciera ? this.ConfigFinanciera.Bancos_JSON : '[]') || []
    };
  }

  async guardarConfigFinanciera() {
    if (!this.Solicitud || !this.ConfigFinanciera) {
      return;
    }
    this.ConfigFinanciera.Bancos_JSON = this.bancosTextoAJson();
    await this.admisionService.guardarConfigFinanciera(this.ConfigFinanciera, this.Solicitud);
    this.recalcularPago();
    await this.admisionService.actualizarCalculoSolicitud(this.Solicitud, this.CalculoPago, this.pagoInfoActual(), this.PlanSeleccionado);
    await this.seleccionar(this.Solicitud);
    Swal.fire('Configuracion financiera guardada', 'El calculo de admision fue actualizado para esta solicitud.', 'success');
  }

  esImagen(url: string, meta: string = ''): boolean {
    const value = (url + ' ' + meta).toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp)(\?|$| )/.test(value) || value.includes('image/');
  }

  esPdf(url: string, meta: string = ''): boolean {
    const value = (url + ' ' + meta).toLowerCase();
    return /\.pdf(\?|$| )/.test(value) || value.includes('application/pdf');
  }

  urlDocumento(url: string): string {
    const value = String(url || '').trim();
    if (!value) {
      return '';
    }
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    if (value.startsWith('/')) {
      return 'https://usantana.com' + value;
    }
    return 'https://usantana.com/' + value;
  }


  urlSeguimiento(): string {
    if (!this.Solicitud || !this.Solicitud.Portal_Token) {
      return '';
    }
    return 'https://usantana.com/admisiones_seguimiento.php?token=' + encodeURIComponent(this.Solicitud.Portal_Token);
  }
  async guardarDocumento(documento: any) {
    await this.admisionService.actualizarDocumento(documento);
    const requiereCorreccion = ['pendiente', 'rechazado', 'requiere_correccion'].includes(String(documento.Estado || ''));
    if (requiereCorreccion && this.Solicitud) {
      const comentario = documento.Observacion || 'Documento pendiente de correccion: ' + documento.Nombre;
      await this.admisionService.cambiarEstado(this.Solicitud, 'documentacion_incompleta', 'pendiente', comentario);
      await this.admisionService.notificar(this.Solicitud, 'correccion');
      Swal.fire('Documento actualizado', 'Se notifico al aspirante para corregir o reenviar documentos.', 'success');
      await this.cargarSolicitudes();
      this.cancel();
      return;
    }
    await this.validarDocumentacionCompleta();
    Swal.fire('Documento actualizado');
    await this.cargarSolicitudes();
    this.cancel();
  }

  async validarDocumentacionCompleta() {
    const pendiente = this.Documentos.some(d => String(d.Requerido) === '1' && d.Estado !== 'aprobado');
    if (!pendiente && this.Solicitud && this.Solicitud.Estado !== 'pendiente_aprobacion') {
      await this.admisionService.cambiarEstado(this.Solicitud, 'pendiente_aprobacion', 'pendiente', 'Documentacion completa');
      this.Solicitud.Estado = 'pendiente_aprobacion';
      await this.cargarSolicitudes();
    }
  }

  async aprobar(resultado: string) {
    if (!this.Solicitud) {
      return;
    }
    const estado = resultado === 'rechazada' ? 'rechazada' : (resultado === 'condicionada' ? 'admitida_condicionada' : 'aprobada');
    await this.admisionService.cambiarEstado(this.Solicitud, estado, resultado, this.Solicitud.Condiciones_Admision || '');
    this.Solicitud.Estado = estado;
    this.Solicitud.Resultado_Admision = resultado;
    await this.admisionService.notificar(this.Solicitud, 'resultado');
    await this.cargarSolicitudes();
    Swal.fire('Solicitud actualizada', 'Se notifico el resultado al aspirante.', 'success');
    this.cancel();
  }

  async generarOrdenPago() {
    if (!this.Solicitud || !this.PlanSeleccionado || !this.MontoOrden) {
      Swal.fire('Seleccione plan y verifique que la solicitud tenga un monto calculado');
      return;
    }
    await this.admisionService.generarOrdenPago(this.Solicitud, this.PlanSeleccionado, this.MontoOrden);
    this.Solicitud.Estado = 'orden_pago';
    await this.admisionService.notificar(this.Solicitud, 'orden_pago');
    await this.cargarSolicitudes();
    Swal.fire('Orden de pago generada', 'Se notifico al aspirante para continuar el pago.', 'success');
    this.cancel();
  }

  async marcarActualizacionRevisada() {
    if (!this.Solicitud) {
      return;
    }
    await this.admisionService.marcarActualizacionRevisada(this.Solicitud);
    this.Solicitud.Revisado_Actualizacion_El = new Date().toISOString();
    await this.cargarSolicitudes();
    Swal.fire('Actualizacion marcada como revisada');
  }


  async guardarOrdenPago(orden: any) {
    if (!this.Solicitud) {
      return;
    }
    await this.admisionService.actualizarOrdenPago(this.Solicitud, orden);
    if (orden.Estado === 'rechazado' || orden.Estado === 'incompleto') {
      await this.admisionService.notificar(this.Solicitud, 'orden_pago');
    }
    await this.seleccionar(this.Solicitud);
    await this.cargarSolicitudes();
    Swal.fire('Pago actualizado');
    this.cancel();
  }
  async aprobarPagoYMatricular() {
    if (!this.Solicitud) {
      return;
    }
    const ok = await Swal.fire({
      title: 'Activar alumno',
      text: 'Se creara/activara persona, usuario, carrera y matricula inicial segun grupos disponibles.',
      showCancelButton: true,
      confirmButtonText: 'Continuar'
    });
    if (!ok.value) {
      return;
    }
    const result = await this.admisionService.aprobarPagoYMatricular(this.Solicitud);
    if (result && result.success === 'true') {
      this.Solicitud.Estado = 'alumno_activo';
      await this.admisionService.notificar(this.Solicitud, 'alumno_activo');
      await this.cargarSolicitudes();
      Swal.fire('Alumno activo');
      this.cancel();
    } else {
      Swal.fire(result && result.error ? result.error : 'No se pudo completar la matricula automatica');
    }
  }
}







