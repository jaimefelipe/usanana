import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdmisionRevisionService {

  constructor(private apiService: ApiService) { }

  private q(value: any): string {
    const text = value === null || value === undefined ? '' : String(value);
    return "'" + text.replace(/'/g, "''") + "'";
  }

  private idEmpresa(): string {
    const idEmpresa = localStorage.getItem('Id_Empresa') || '1';
    return /^\d+$/.test(idEmpresa) ? idEmpresa : '1';
  }

  async cargarSolicitudes(paginacion: any, search?: any, estado?: string) {
    const filtros = ['s.Id_Empresa = ' + this.idEmpresa()];
    if (estado) {
      filtros.push("s.Estado = '" + estado.replace(/'/g, "''") + "'");
    }
    const sqlConfig = {
      table: 'Edu_Admision_Solicitud s LEFT JOIN Edu_Carrera c ON c.Id_Carrera = s.Id_Carrera',
      fields: 's.Id_Admision_Solicitud,s.Codigo,s.Portal_Token,s.Nombre,s.Identificacion,s.Correo,s.Telefono,COALESCE(c.Carrera,\'Sin carrera\') AS Carrera,s.Modalidad,s.Estado,s.Resultado_Admision,s.Fecha_Envio,s.Fecha_Ultima_Actualizacion_Aspirante,s.Revisado_Actualizacion_El,CASE WHEN s.Fecha_Ultima_Actualizacion_Aspirante IS NOT NULL AND (s.Revisado_Actualizacion_El IS NULL OR s.Revisado_Actualizacion_El < s.Fecha_Ultima_Actualizacion_Aspirante) THEN 1 ELSE 0 END AS Aspirante_Actualizo',
      where: filtros.join(' AND '),
      searchField: search,
      orderField: 's.Id_Admision_Solicitud',
      orderDirection: ' DESC ',
      paginacion,
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarSolicitud(idSolicitud: any) {
    const sqlConfig = {
      table: 'Edu_Admision_Solicitud s LEFT JOIN Edu_Carrera c ON c.Id_Carrera = s.Id_Carrera',
      fields: 's.*,COALESCE(c.Carrera,\'Sin carrera\') AS Carrera,c.Nivel AS Carrera_Nivel',
      where: 's.Id_Empresa = ' + this.idEmpresa() + ' AND s.Id_Admision_Solicitud = ' + idSolicitud,
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarDocumentos(idSolicitud: any) {
    const sqlConfig = {
      table: 'Edu_Admision_Documento',
      fields: 'Id_Admision_Documento,Tipo_Documento,Nombre,Requerido,URL,Nombre_Archivo,Mime_Type,Estado,Observacion,Revisado_El,Revisado_Por',
      where: 'Id_Empresa = ' + this.idEmpresa() + ' AND Id_Admision_Solicitud = ' + idSolicitud,
      orderField: 'Id_Admision_Documento',
      orderDirection: ' ASC ',
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }


  async cargarBitacora(idSolicitud: any) {
    const sqlConfig = {
      table: 'Edu_Admision_Bitacora',
      fields: 'Id_Admision_Bitacora,Estado_Anterior,Estado_Nuevo,Accion,Comentario,Creado_El,Creado_Por',
      where: 'Id_Empresa = ' + this.idEmpresa() + ' AND Id_Admision_Solicitud = ' + idSolicitud,
      orderField: 'Id_Admision_Bitacora',
      orderDirection: ' DESC ',
      paginacion: { FirstRow: 1, LastRow: 100 },
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarPlanesPago() {
    const sqlConfig = {
      table: 'Edu_Admision_Plan_Pago',
      fields: 'Id_Admision_Plan_Pago,Codigo,Nombre,Tipo,Descuento_Porcentaje,Numero_Cuotas,Dias_Primer_Pago,Interes_Porcentaje',
      where: 'Id_Empresa = ' + this.idEmpresa() + ' AND Activo = 1',
      orderField: 'Id_Admision_Plan_Pago',
      orderDirection: ' ASC ',
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarConfigFinanciera(solicitud: any) {
    const idSolicitud = Number(solicitud.Id_Admision_Solicitud || 0);
    const sqlPorSolicitud = {
      table: 'Edu_Admision_Solicitud s LEFT JOIN Edu_Carrera c ON c.Id_Carrera=s.Id_Carrera INNER JOIN Edu_Admision_Config_Financiera f ON f.Id_Empresa=s.Id_Empresa AND f.Activo=1 AND f.Id_Carrera=s.Id_Carrera',
      fields: 'f.Id_Config_Financiera,f.Id_Empresa,f.Id_Carrera,f.Nivel,f.Nombre,f.Moneda,f.Cursos_Por_Bloque,f.Creditos_Por_Curso,f.Precio_Credito,f.Precio_Curso,f.Matricula_Bloque,f.Medio_Pago_Texto,f.Bancos_JSON,f.Notificar_Email,f.Activo',
      where: 's.Id_Empresa=' + this.idEmpresa() + ' AND s.Id_Admision_Solicitud=' + idSolicitud,
      orderField: 'Id_Config_Financiera',
      orderDirection: ' DESC ',
      Empresa: false
    };
    const porSolicitud = await this.apiService.executeSqlSyn(sqlPorSolicitud);
    if (porSolicitud && porSolicitud.data && porSolicitud.data.length) {
      return porSolicitud;
    }
    const sqlPorNivel = {
      table: 'Edu_Admision_Solicitud s LEFT JOIN Edu_Carrera c ON c.Id_Carrera=s.Id_Carrera INNER JOIN Edu_Admision_Config_Financiera f ON f.Id_Empresa=s.Id_Empresa AND f.Activo=1 AND f.Id_Carrera IS NULL AND f.Nivel=COALESCE(c.Nivel,s.Nivel)',
      fields: 'f.Id_Config_Financiera,f.Id_Empresa,f.Id_Carrera,f.Nivel,f.Nombre,f.Moneda,f.Cursos_Por_Bloque,f.Creditos_Por_Curso,f.Precio_Credito,f.Precio_Curso,f.Matricula_Bloque,f.Medio_Pago_Texto,f.Bancos_JSON,f.Notificar_Email,f.Activo',
      where: 's.Id_Empresa=' + this.idEmpresa() + ' AND s.Id_Admision_Solicitud=' + idSolicitud,
      orderField: 'Id_Config_Financiera',
      orderDirection: ' DESC ',
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlPorNivel);
  }

  async guardarConfigFinanciera(config: any, solicitud: any) {
    const idCarreraSql = config.Id_Carrera ? String(config.Id_Carrera) : 'NULL';
    const bancosJson = config.Bancos_JSON || '[]';
    if (config.Id_Config_Financiera) {
      const sql = {
        table: 'Edu_Admision_Config_Financiera',
        fields: [
          'Id_Carrera=' + idCarreraSql,
          'Nivel=' + this.q(config.Nivel || solicitud.Nivel || ''),
          'Nombre=' + this.q(config.Nombre || ('Configuracion admision ' + (solicitud.Carrera || ''))),
          'Moneda=' + this.q(config.Moneda || 'CRC'),
          'Cursos_Por_Bloque=' + Number(config.Cursos_Por_Bloque || 4),
          'Creditos_Por_Curso=' + Number(config.Creditos_Por_Curso || 3),
          'Precio_Credito=' + Number(config.Precio_Credito || 0),
          'Precio_Curso=' + Number(config.Precio_Curso || 0),
          'Matricula_Bloque=' + Number(config.Matricula_Bloque || 0),
          'Medio_Pago_Texto=' + this.q(config.Medio_Pago_Texto || ''),
          'Bancos_JSON=' + this.q(bancosJson),
          'Notificar_Email=' + this.q(config.Notificar_Email || ''),
          'Modificado_El=NOW()',
          'Modificado_Por=' + this.q(localStorage.getItem('Nombre_Usuario') || '')
        ].join(','),
        where: 'Id_Empresa=' + this.idEmpresa() + ' AND Id_Config_Financiera=' + config.Id_Config_Financiera,
        Empresa: false
      };
      return await this.apiService.updateRecord(sql);
    }
    const sql = {
      table: 'Edu_Admision_Config_Financiera',
      fields: 'Id_Carrera,Nivel,Nombre,Moneda,Cursos_Por_Bloque,Creditos_Por_Curso,Precio_Credito,Precio_Curso,Matricula_Bloque,Medio_Pago_Texto,Bancos_JSON,Notificar_Email,Activo',
      values: [
        idCarreraSql,
        this.q(config.Nivel || solicitud.Nivel || ''),
        this.q(config.Nombre || ('Configuracion admision ' + (solicitud.Carrera || ''))),
        this.q(config.Moneda || 'CRC'),
        Number(config.Cursos_Por_Bloque || 4),
        Number(config.Creditos_Por_Curso || 3),
        Number(config.Precio_Credito || 0),
        Number(config.Precio_Curso || 0),
        Number(config.Matricula_Bloque || 0),
        this.q(config.Medio_Pago_Texto || ''),
        this.q(bancosJson),
        this.q(config.Notificar_Email || ''),
        1
      ].join(',')
    };
    return await this.apiService.insertRecord(sql);
  }

  async actualizarCalculoSolicitud(solicitud: any, calculo: any, pagoInfo: any, plan: any) {
    const sql = {
      table: 'Edu_Admision_Solicitud',
      fields: [
        'Id_Admision_Plan_Pago=' + (plan ? Number(plan.Id_Admision_Plan_Pago || 0) : 'NULL'),
        'Monto_Base_Estimado=' + Number(calculo.monto_base || 0),
        'Descuento_Estimado=' + Number(calculo.descuento || 0),
        'Total_Estimado=' + Number(calculo.total || 0),
        'Numero_Cuotas_Estimado=' + Number(calculo.numero_cuotas || 1),
        'Cuota_Estimada=' + Number(calculo.cuota_monto || 0),
        'Calculo_Pago_JSON=' + this.q(JSON.stringify(calculo || {})),
        'Pago_Info_JSON=' + this.q(JSON.stringify(pagoInfo || {})),
        'Modificado_El=NOW()',
        'Modificado_Por=' + this.q(localStorage.getItem('Nombre_Usuario') || '')
      ].join(','),
      where: 'Id_Empresa=' + this.idEmpresa() + ' AND Id_Admision_Solicitud=' + solicitud.Id_Admision_Solicitud,
      Empresa: false
    };
    return await this.apiService.updateRecord(sql);
  }

  async cargarPlanEstudios(idCarrera: any) {
    const sqlConfig = {
      table: 'Edu_Curso_Carrera cc INNER JOIN Edu_Curso c ON c.Id_Curso = cc.Id_Curso',
      fields: 'cc.Id_Curso_Carrera,cc.Id_Curso,cc.Bloque,c.Codigo,c.Curso,c.Creditos',
      where: 'cc.Id_Empresa=' + this.idEmpresa() + ' AND cc.Estado=1 AND cc.Id_Carrera=' + Number(idCarrera || 0),
      orderField: 'cc.Bloque, c.Curso',
      orderDirection: ' ASC ',
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async actualizarDocumento(documento: any) {
    const sql = {
      table: 'Edu_Admision_Documento',
      fields: [
        'Estado=' + this.q(documento.Estado),
        'Observacion=' + this.q(documento.Observacion || ''),
        'Revisado_El=NOW()',
        'Revisado_Por=' + this.q(localStorage.getItem('Nombre_Usuario') || '')
      ].join(','),
      where: 'Id_Empresa=' + this.idEmpresa() + ' AND Id_Admision_Documento=' + documento.Id_Admision_Documento,
      Empresa: false
    };
    return await this.apiService.updateRecord(sql);
  }

  async cambiarEstado(solicitud: any, estado: string, resultado: string, comentario: string) {
    const anterior = solicitud.Estado || '';
    const sql = {
      table: 'Edu_Admision_Solicitud',
      fields: [
        'Estado=' + this.q(estado),
        'Resultado_Admision=' + this.q(resultado || solicitud.Resultado_Admision || 'pendiente'),
        'Condiciones_Admision=' + this.q(comentario || solicitud.Condiciones_Admision || ''),
        estado === 'pendiente_aprobacion' ? 'Fecha_Documentacion_Completa=NOW()' : '',
        (estado === 'aprobada' || estado === 'admitida_condicionada' || estado === 'rechazada') ? 'Fecha_Aprobacion=NOW()' : ''
      ].filter(Boolean).join(','),
      where: 'Id_Empresa=' + this.idEmpresa() + ' AND Id_Admision_Solicitud=' + solicitud.Id_Admision_Solicitud,
      Empresa: false
    };
    const result = await this.apiService.updateRecord(sql);
    await this.registrarBitacora(solicitud.Id_Admision_Solicitud, anterior, estado, 'Cambio de estado', comentario);
    solicitud.Estado = estado;
    solicitud.Resultado_Admision = resultado || solicitud.Resultado_Admision || 'pendiente';
    solicitud.Condiciones_Admision = comentario || solicitud.Condiciones_Admision || '';
    return result;
  }

  async generarOrdenPago(solicitud: any, plan: any, monto?: any) {
    const referencia = 'ADM-' + solicitud.Id_Admision_Solicitud + '-' + Date.now().toString().slice(-6);
    const base = Number(solicitud.Monto_Base_Estimado || monto || 0);
    const descuento = base * (Number(plan.Descuento_Porcentaje || 0) / 100);
    const interes = (base - descuento) * (Number(plan.Interes_Porcentaje || 0) / 100);
    const total = Math.max(0, base - descuento + interes);
    const cuotas = Math.max(1, Number(plan.Numero_Cuotas || solicitud.Numero_Cuotas_Estimado || 1));
    const cuotaMonto = total / cuotas;
    const calculo = {
      monto_base: base,
      descuento,
      interes,
      total,
      numero_cuotas: cuotas,
      cuota_monto: cuotaMonto,
      descuento_porcentaje: Number(plan.Descuento_Porcentaje || 0),
      interes_porcentaje: Number(plan.Interes_Porcentaje || 0)
    };
    const pagoInfo = solicitud.Pago_Info_JSON || '';
    const sql = {
      table: 'Edu_Admision_Orden_Pago',
      Empresa: false,
      fields: 'Id_Empresa,Id_Admision_Solicitud,Id_Admision_Plan_Pago,Referencia,Concepto,Moneda,Monto,Descuento,Total,Numero_Cuotas,Cuota_Monto,Fecha_Limite,Estado,Medio_Pago,Calculo_JSON,Pago_Info_JSON',
      values: [
        this.idEmpresa(),
        solicitud.Id_Admision_Solicitud,
        plan.Id_Admision_Plan_Pago,
        this.q(referencia),
        this.q('Admision y matricula inicial ' + solicitud.Carrera),
        this.q(solicitud.Moneda || 'CRC'),
        base,
        descuento,
        total,
        cuotas,
        cuotaMonto,
        'DATE_ADD(CURDATE(), INTERVAL ' + Number(plan.Dias_Primer_Pago || 8) + ' DAY)',
        this.q('pendiente'),
        this.q('Portal de seguimiento'),
        this.q(JSON.stringify(calculo)),
        this.q(pagoInfo)
      ].join(',')
    };
    const result = await this.apiService.insertRecord(sql);
    await this.cambiarEstado(solicitud, 'orden_pago', 'aprobada', 'Orden de pago generada: ' + referencia);
    return result;
  }

  async marcarActualizacionRevisada(solicitud: any) {
    const sql = {
      table: 'Edu_Admision_Solicitud',
      fields: 'Revisado_Actualizacion_El=NOW()',
      where: 'Id_Empresa=' + this.idEmpresa() + ' AND Id_Admision_Solicitud=' + solicitud.Id_Admision_Solicitud,
      Empresa: false
    };
    const result = await this.apiService.updateRecord(sql);
    await this.registrarBitacora(solicitud.Id_Admision_Solicitud, solicitud.Estado || '', solicitud.Estado || '', 'Actualizacion del aspirante revisada', 'Se marco como revisada la ultima actualizacion enviada desde el portal.');
    return result;
  }


  async cargarOrdenesPago(idSolicitud: any) {
    const sqlConfig = {
      table: 'Edu_Admision_Orden_Pago o LEFT JOIN Edu_Admision_Plan_Pago p ON p.Id_Admision_Plan_Pago = o.Id_Admision_Plan_Pago',
      fields: 'o.Id_Admision_Orden_Pago,o.Referencia,o.Concepto,o.Moneda,o.Monto,o.Descuento,o.Total,o.Numero_Cuotas,o.Cuota_Monto,o.Fecha_Limite,o.Estado,o.Medio_Pago,o.Comprobante_URL,o.Observacion_Financiera,o.Revisado_El,o.Revisado_Por,o.Pago_Info_JSON,COALESCE(p.Nombre,\'Sin plan\') AS Plan_Pago',
      where: 'o.Id_Empresa = ' + this.idEmpresa() + ' AND o.Id_Admision_Solicitud = ' + idSolicitud,
      orderField: 'o.Id_Admision_Orden_Pago',
      orderDirection: ' DESC ',
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async actualizarOrdenPago(solicitud: any, orden: any) {
    const sql = {
      table: 'Edu_Admision_Orden_Pago',
      fields: [
        'Estado=' + this.q(orden.Estado),
        'Observacion_Financiera=' + this.q(orden.Observacion_Financiera || ''),
        'Revisado_El=NOW()',
        'Revisado_Por=' + this.q(localStorage.getItem('Nombre_Usuario') || '')
      ].join(','),
      where: 'Id_Empresa=' + this.idEmpresa() + ' AND Id_Admision_Orden_Pago=' + orden.Id_Admision_Orden_Pago,
      Empresa: false
    };
    const result = await this.apiService.updateRecord(sql);
    if (orden.Estado === 'aprobado') {
      await this.cambiarEstado(solicitud, 'pago_aprobado', solicitud.Resultado_Admision || 'aprobada', 'Pago aprobado por finanzas');
    } else if (orden.Estado === 'rechazado' || orden.Estado === 'incompleto') {
      await this.cambiarEstado(solicitud, 'pago_pendiente', solicitud.Resultado_Admision || 'aprobada', orden.Observacion_Financiera || 'Pago requiere correccion');
    }
    return result;
  }
  async aprobarPagoYMatricular(solicitud: any) {
    const sql = 'CALL sp_Edu_Admision_Activar_Alumno(' + solicitud.Id_Admision_Solicitud + ',' + this.idEmpresa() + ',' + this.q(localStorage.getItem('Nombre_Usuario') || 'sistema') + ')';
    return await this.apiService.postRecord(sql);
  }

  async registrarBitacora(idSolicitud: any, anterior: string, nuevo: string, accion: string, comentario: string) {
    const sql = {
      table: 'Edu_Admision_Bitacora',
      Empresa: false,
      fields: 'Id_Empresa,Id_Admision_Solicitud,Estado_Anterior,Estado_Nuevo,Accion,Comentario',
      values: [this.idEmpresa(), idSolicitud, this.q(anterior), this.q(nuevo), this.q(accion), this.q(comentario || '')].join(',')
    };
    return await this.apiService.insertRecord(sql);
  }

  async notificar(solicitud: any, tipo: 'recibida' | 'correccion' | 'resultado' | 'orden_pago' | 'alumno_activo') {
    if (!solicitud || !solicitud.Id_Admision_Solicitud) {
      return null;
    }
    const response = await fetch('https://usantana.com/admisiones_notificar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_solicitud: solicitud.Id_Admision_Solicitud,
        token: solicitud.Portal_Token || '',
        tipo
      })
    });
    return await response.json();
  }
}


