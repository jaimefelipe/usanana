import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SemanaDetalleService {

  constructor(
    private apiService:ApiService
  ) { }

  private accesoSemanaWhere(Id_Semana) {
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idUsuario = Number(localStorage.getItem('Id_Usuario'));
    const idSemana = Number(Id_Semana);

    if (!idEmpresa || !idUsuario || !idSemana) {
      return '1 = 0';
    }

    return 's.Id_Semana = ' + idSemana
      + ' and alumno.Id_Empresa = ' + idEmpresa
      + ' and alumno.Id_Usuario = ' + idUsuario
      + ' and md.Estado = 1'
      + ' and c.Estado = 1'
      + ' and g.Estado = 1'
      + ' and av.Activo = 1';
  }

  async leerRecursosSemana(Id_Semana){
    let sqlConfig = {
        table: 'Gen_Persona alumno INNER JOIN Edu_Matricula m ON alumno.Id_Persona = m.Id_Persona INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso INNER JOIN Lms_AulaVirtual av ON av.Id_Grupo = g.Id_Grupo AND av.Activo = 1 INNER JOIN Lms_SemanaCurso s ON s.Id_AulaVirtual = av.Id_AulaVirtual INNER JOIN Lms_Recurso r ON r.Id_Semana = s.Id_Semana',
        fields: 'r.Id_Recurso,r.Id_Semana,r.Titulo,r.Tipo,r.URL,CASE WHEN r.Tipo = 1 THEN r.Contenido ELSE r.URL END AS Contenido',
        orderField: 'r.Id_Recurso',
        orderDirection: ' ASC ',
        Empresa:false,
        where: this.accesoSemanaWhere(Id_Semana) + ' and (r.Estado = 1 or r.Estado is null or CAST(r.Estado AS CHAR) = \'\')'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerActividadesSemana(Id_Semana){
    let sqlConfig = {
        table: 'Gen_Persona alumno INNER JOIN Edu_Matricula m ON alumno.Id_Persona = m.Id_Persona INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso INNER JOIN Lms_AulaVirtual av ON av.Id_Grupo = g.Id_Grupo AND av.Activo = 1 INNER JOIN Lms_SemanaCurso s ON s.Id_AulaVirtual = av.Id_AulaVirtual INNER JOIN Lms_Actividad a ON a.Id_Semana = s.Id_Semana',
        fields: 'a.Id_Actividad,a.Nombre,a.Tipo,a.Instrucciones,a.Fecha_Limite,a.Puntaje,a.URL',
        orderField: 'a.Id_Actividad',
        orderDirection: ' ASC ',
        Empresa:false,
        where: this.accesoSemanaWhere(Id_Semana) + ' and a.Estado = 1'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
