import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class ActividadAlumnoService {

constructor(
  private apiService:ApiService
) { }
  async subirArchivo(file){
      return await this.apiService.loadPublicFile(file);
    }
  private accesoActividadWhere(Id_Actividad){
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idUsuario = Number(localStorage.getItem('Id_Usuario'));
    const idActividad = Number(Id_Actividad);

    if (!idEmpresa || !idUsuario || !idActividad) {
      return '1 = 0';
    }

    return 'a.Id_Actividad = ' + idActividad
      + ' and alumno.Id_Empresa = ' + idEmpresa
      + ' and alumno.Id_Usuario = ' + idUsuario
      + ' and md.Estado = 1'
      + ' and c.Estado = 1'
      + ' and g.Estado = 1'
      + ' and av.Activo = 1'
      + ' and a.Estado = 1';
  }

  private async puedeAccederActividad(Id_Actividad){
    const sqlConfig = {
      table: 'Gen_Persona alumno INNER JOIN Edu_Matricula m ON alumno.Id_Persona = m.Id_Persona INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso INNER JOIN Lms_AulaVirtual av ON av.Id_Grupo = g.Id_Grupo AND av.Activo = 1 INNER JOIN Lms_SemanaCurso s ON s.Id_AulaVirtual = av.Id_AulaVirtual INNER JOIN Lms_Actividad a ON a.Id_Semana = s.Id_Semana',
      fields: 'a.Id_Actividad',
      Empresa:false,
      where: this.accesoActividadWhere(Id_Actividad)
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    return (data?.['data'] || []).length > 0;
  }

  async guardarParticipacion(actividad){
    const autorizado = await this.puedeAccederActividad(actividad.Id_Actividad);
    if (!autorizado) {
      return {
        success: 'false',
        message: 'La actividad no esta disponible para este usuario o el grupo esta cerrado.'
      };
    }

    let sql = {
      table: 'Lms_EntregaActividad',
      fields: 'Id_Actividad,Id_Usuario,Url',
      values: '\'' + actividad.Id_Actividad
      + '\',\'' + localStorage.getItem('Id_Usuario')
      + '\',\'' + actividad.Url + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async obtenerParticipaciones(Id_Actividad){
    let sqlConfig = {
      table: 'Gen_Persona alumno INNER JOIN Edu_Matricula m ON alumno.Id_Persona = m.Id_Persona INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso INNER JOIN Lms_AulaVirtual av ON av.Id_Grupo = g.Id_Grupo AND av.Activo = 1 INNER JOIN Lms_SemanaCurso s ON s.Id_AulaVirtual = av.Id_AulaVirtual INNER JOIN Lms_Actividad a ON a.Id_Semana = s.Id_Semana INNER JOIN Lms_EntregaActividad e ON e.Id_Actividad = a.Id_Actividad',
      fields: 'e.Id_Entrega,e.Url,e.Nota,e.Comentario_Docente,e.Creado_El',
      Empresa:false,
      where: this.accesoActividadWhere(Id_Actividad)
        + ' and e.Id_Usuario = ' + Number(localStorage.getItem('Id_Usuario'))
        + ' and e.Id_Empresa = ' + Number(localStorage.getItem('Id_Empresa'))
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }


}
