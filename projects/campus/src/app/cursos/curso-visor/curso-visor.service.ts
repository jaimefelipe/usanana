import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CursoVisorService {

constructor(private apiService:ApiService) { }

  async leerCurso(){
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idUsuario = Number(localStorage.getItem('Id_Usuario'));
    const idCurso = Number(localStorage.getItem('Id_Curso'));
    const idGrupo = Number(localStorage.getItem('Id_Grupo'));

    if(!idEmpresa || !idUsuario || (!idCurso && !idGrupo)){
      return { success: 'false', total: 0, data: [] };
    }

    const filtroCurso = idGrupo
      ? 'g.Id_Grupo = ' + idGrupo
      : 'g.Id_Curso = ' + idCurso;

    let sqlConfig = {
        table: 'Gen_Persona alumno INNER JOIN Edu_Matricula m ON alumno.Id_Persona = m.Id_Persona INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso LEFT JOIN Gen_Persona Profesor ON Profesor.Id_Persona = g.Id_Profesor LEFT JOIN Lms_AulaVirtual av ON av.Id_Grupo = g.Id_Grupo AND av.Activo = 1',
        fields: "c.Codigo AS Codigo,c.Curso AS Curso,c.Creditos AS Creditos,c.Horas AS Horas,c.Descripcion AS Descripcion,g.Nombre AS Grupo,CASE WHEN g.Modalidad IN ('V','2') THEN 'Virtual' WHEN g.Modalidad IN ('P','1') THEN 'Presencial' WHEN g.Modalidad IN ('T','3') THEN 'Tutoria' WHEN g.Modalidad = 'S' THEN 'Suficiencia' ELSE g.Modalidad END AS Modalidad,Profesor.Nombre AS Nombre,COALESCE(av.Bienvenida, '') AS Bienvenida,IF(av.Imagen IS NOT NULL AND LENGTH(av.Imagen) > 0, av.Imagen, c.Imagen) AS Imagen",
        orderField: 'c.Codigo',
        searchField: '',
        Empresa:false,
        where: filtroCurso + ' and alumno.Id_Empresa = ' + idEmpresa + ' and alumno.Id_Usuario = ' + idUsuario + ' and md.Estado = 1 and c.Estado = 1 and g.Estado = 1'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async leerSemanas(){
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idUsuario = Number(localStorage.getItem('Id_Usuario'));
    const idCurso = Number(localStorage.getItem('Id_Curso'));
    const idGrupo = Number(localStorage.getItem('Id_Grupo'));

    if(!idEmpresa || !idUsuario || (!idCurso && !idGrupo)){
      return { success: 'false', total: 0, data: [] };
    }

    const filtroCurso = idGrupo
      ? 'g.Id_Grupo = ' + idGrupo
      : 'g.Id_Curso = ' + idCurso;

    let sqlConfig = {
        table: 'Gen_Persona alumno INNER JOIN Edu_Matricula m ON alumno.Id_Persona = m.Id_Persona INNER JOIN Edu_Matricula_Detalle md ON m.Id_Matricula = md.Id_Matricula INNER JOIN Edu_Grupo g ON md.Id_Grupo = g.Id_Grupo INNER JOIN Edu_Curso c ON g.Id_Curso = c.Id_Curso INNER JOIN Lms_AulaVirtual av ON av.Id_Grupo = g.Id_Grupo AND av.Activo = 1 INNER JOIN Lms_SemanaCurso s ON s.Id_AulaVirtual = av.Id_AulaVirtual',
        fields: 's.Id_Semana AS Id_Semana,s.Numero_Semana AS Numero_Semana,s.Titulo AS Titulo,s.RutaAprendizaje AS RutaAprendizaje',
        orderField: 's.Numero_Semana',
        orderDirection: ' ASC ',
        searchField: '',
        Empresa:false,
        where: filtroCurso + ' and alumno.Id_Empresa = ' + idEmpresa + ' and alumno.Id_Usuario = ' + idUsuario + ' and md.Estado = 1 and c.Estado = 1 and g.Estado = 1 and av.Activo = 1'
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  // ── Progreso de semanas (avance del curso) ─────────────────
  async leerProgreso(){
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idUsuario = Number(localStorage.getItem('Id_Usuario'));

    if(!idEmpresa || !idUsuario){
      return { success: 'false', total: 0, data: [] };
    }

    let sqlConfig = {
      table: 'Lms_Progreso_Semana',
      fields: 'Id_Semana',
      Empresa: false,
      where: `Id_Empresa = ${idEmpresa} AND Id_Usuario = ${idUsuario}`
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async marcarSemanaCompletada(Id_Semana){
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    const idUsuario = Number(localStorage.getItem('Id_Usuario'));

    if(!idEmpresa || !idUsuario || !Number(Id_Semana)){
      return { success: 'false' };
    }

    const sql = `INSERT INTO Lms_Progreso_Semana (Id_Empresa, Id_Usuario, Id_Semana, Completado_El)
      VALUES (${idEmpresa}, ${idUsuario}, ${Number(Id_Semana)}, NOW())
      ON DUPLICATE KEY UPDATE Completado_El = Completado_El`;
    return await this.apiService.postRecord(sql);
  }

}
