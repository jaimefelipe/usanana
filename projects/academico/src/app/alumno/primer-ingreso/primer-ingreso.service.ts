import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrimerIngresoService {

  constructor(private apiService: ApiService) { }

  private q(value: any): string {
    const text = value === null || value === undefined ? '' : String(value);
    return "'" + text.replace(/'/g, "''") + "'";
  }

  async cargarPlanesPago() {
    const sqlConfig = {
      table: 'Edu_Admision_Plan_Pago',
      fields: 'Id_Admision_Plan_Pago,Codigo,Nombre,Tipo,Descuento_Porcentaje,Numero_Cuotas,Dias_Primer_Pago,Interes_Porcentaje',
      where: 'Activo = 1',
      orderField: 'Id_Admision_Plan_Pago',
      orderDirection: ' ASC '
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async crearSolicitud(persona: any, documentos: any[]) {
    const idEmpresa = localStorage.getItem('Id_Empresa') || '1';
    const usuario = localStorage.getItem('Nombre_Usuario') || 'web';
    const codigo = 'ADM-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-8);
    const sql = {
      table: 'Edu_Admision_Solicitud',
      Empresa: false,
      fields: 'Id_Empresa,Codigo,Nombre,Tipo_Identificacion,Identificacion,Correo,Telefono,Direccion,Id_Carrera,Modalidad,Id_Sucursal,Nivel,Colegio_Procedencia,Ultimo_Grado,Anio_Graduacion,Promedio,Observaciones,Estado,Portal_Token,Creado_Por,Creado_El',
      values: [
        idEmpresa,
        this.q(codigo),
        this.q(persona.Nombre),
        this.q(persona.Tipo_Identificacion),
        this.q(persona.Identificacion),
        this.q(persona.Correo),
        this.q(persona.Telefono),
        this.q(persona.Direccion),
        persona.Carrera || 'NULL',
        this.q(persona.Modalidad),
        persona.Id_Sucursal || 'NULL',
        this.q(persona.Nivel),
        this.q(persona.Colegio_Procedencia),
        this.q(persona.Ultimo_Grado),
        this.q(persona.Anio_Graduacion),
        this.q(persona.Promedio),
        this.q(persona.Observaciones),
        "'solicitud_recibida'",
        this.q(codigo + '-' + Math.random().toString(36).slice(2, 10)),
        this.q(usuario),
        'NOW()'
      ].join(',')
    };
    const solicitud = await this.apiService.insertRecord(sql);
    if (solicitud && solicitud['success'] === 'true') {
      const idSolicitud = solicitud['Identity'];
      await this.crearDocumentosBase(idSolicitud, documentos);
      await this.registrarBitacora(idSolicitud, '', 'solicitud_recibida', 'Solicitud recibida', 'El aspirante envio la solicitud inicial.');
    }
    return solicitud;
  }

  async crearDocumentosBase(idSolicitud: any, documentos: any[]) {
    const tipos = [
      { Tipo_Documento: 'identificacion', Nombre: 'Cedula, DIMEX o pasaporte', Requerido: 1 },
      { Tipo_Documento: 'titulo', Nombre: 'Titulo academico', Requerido: 1 },
      { Tipo_Documento: 'notas', Nombre: 'Certificacion de notas', Requerido: 1 },
      { Tipo_Documento: 'foto', Nombre: 'Fotografia', Requerido: 1 },
      { Tipo_Documento: 'otro', Nombre: 'Otros documentos', Requerido: 0 }
    ];
    for (const tipo of tipos) {
      const doc = (documentos || []).find(d => d.Tipo_Documento === tipo.Tipo_Documento) || {};
      const estado = doc.URL ? 'recibido' : 'pendiente';
      const idEmpresa = localStorage.getItem('Id_Empresa') || '1';
      const sql = {
        table: 'Edu_Admision_Documento',
        Empresa: false,
        fields: 'Id_Empresa,Id_Admision_Solicitud,Tipo_Documento,Nombre,Requerido,URL,Nombre_Archivo,Mime_Type,Estado',
        values: [
          idEmpresa,
          idSolicitud,
          this.q(tipo.Tipo_Documento),
          this.q(tipo.Nombre),
          tipo.Requerido,
          this.q(doc.URL || ''),
          this.q(doc.Nombre_Archivo || ''),
          this.q(doc.Mime_Type || ''),
          this.q(estado)
        ].join(',')
      };
      await this.apiService.insertRecord(sql);
    }
  }

  async registrarBitacora(idSolicitud: any, anterior: string, nuevo: string, accion: string, comentario: string) {
    const sql = {
      table: 'Edu_Admision_Bitacora',
      Empresa: false,
      fields: 'Id_Empresa,Id_Admision_Solicitud,Estado_Anterior,Estado_Nuevo,Accion,Comentario',
      values: [
        localStorage.getItem('Id_Empresa') || '1',
        idSolicitud,
        this.q(anterior),
        this.q(nuevo),
        this.q(accion),
        this.q(comentario)
      ].join(',')
    };
    return await this.apiService.insertRecord(sql);
  }

  async subirDocumento(file: FormData) {
    return await this.apiService.loadPublicFile(file);
  }

}
