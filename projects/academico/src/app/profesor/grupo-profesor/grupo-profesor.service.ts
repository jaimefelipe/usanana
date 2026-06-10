import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoProfesorService {

constructor(private apiService:ApiService) { }

async cargarGrupos(paginacion,search?) {
    let sqlConfig = {
      table: 'Edu_Grupo Inner Join Edu_Curso on Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso inner Join Edu_Periodo_Academico On Edu_Grupo.Id_Periodo = Edu_Periodo_Academico.Id_Periodo_Academico inner Join Gen_Sucursal on Edu_Grupo.Id_Sucursal = Gen_Sucursal.Id_Sucursal inner Join Gen_Persona on Edu_Grupo.Id_Profesor = Gen_Persona.Id_Persona',
      fields: 'Id_Grupo,Aula,Id_Periodo,Dia,Hora,Edu_Grupo.Estado,Modalidad,Edu_Curso.Codigo, Edu_Curso.Curso,Edu_Periodo_Academico.Periodo,Gen_Sucursal.Nombre',
      orderField: '',
      searchField: '',
      simple:true,
      where: 'Edu_Grupo.Estado = 1 and Gen_Persona.Id_Usuario = ' + localStorage.getItem('Id_Usuario')
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarAlumnos(Id_Grupo){
    let sqlConfig = {
      table: 'Edu_Matricula_Detalle Inner Join Edu_Matricula on Edu_Matricula_Detalle.Id_Matricula = Edu_Matricula.Id_Matricula inner Join Gen_Persona on Edu_Matricula.Id_Persona = Gen_Persona.Id_Persona',
      fields: 'Id_Matricula_Detalle, Rubrica_1,Rubrica_2,Rubrica_3,Rubrica_4,Rubrica_5,Promedio,Gen_Persona.Nombre,Edu_Matricula_Detalle.Estado',
      orderField: '',
      searchField: '',
      simple:true,
      where: 'Id_Grupo = ' + Id_Grupo
    };
     return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async grabarNotas(estudiante){
    let sqlConfig = {
      table: 'Edu_Matricula_Detalle',
      fields: 'Rubrica_1=\'' + estudiante.Rubrica_1 + '\',Rubrica_2=\'' + estudiante.Rubrica_2 + '\',Rubrica_3=\'' +  estudiante.Rubrica_3 + '\',Rubrica_4=\'' +  estudiante.Rubrica_4+ '\',Rubrica_5=\'' +  estudiante.Rubrica_5+ '\',Promedio=\'' +  estudiante.Promedio+ '\',Estado=\'' +  estudiante.Estado   + '\'',
      where: 'Id_Matricula_Detalle=' + estudiante.Id_Matricula_Detalle
    };
    return await this.apiService.updateRecord(sqlConfig);
  }

  async cargarActividadesGrupo(Id_Grupo){
    const sql = `
      SELECT
        A.Id_Actividad,
        A.Nombre,
        A.Tipo,
        A.Puntaje,
        A.Fecha_Limite,
        S.Numero_Semana,
        S.Titulo AS Semana,
        COUNT(EA.Id_Entrega) AS Entregas,
        SUM(CASE WHEN EA.Nota IS NOT NULL THEN 1 ELSE 0 END) AS Revisadas
      FROM Lms_AulaVirtual AV
      INNER JOIN Lms_SemanaCurso S
        ON S.Id_AulaVirtual = AV.Id_AulaVirtual
      INNER JOIN Lms_Actividad A
        ON A.Id_Semana = S.Id_Semana
      LEFT JOIN Lms_EntregaActividad EA
        ON EA.Id_Actividad = A.Id_Actividad
        AND EA.Id_Empresa = AV.Id_Empresa
      WHERE AV.Id_Grupo = ${Number(Id_Grupo)}
        AND AV.Id_Empresa = ${localStorage.getItem('Id_Empresa')}
        AND A.Tipo <> '3'
      GROUP BY
        A.Id_Actividad,
        A.Nombre,
        A.Tipo,
        A.Puntaje,
        A.Fecha_Limite,
        S.Numero_Semana,
        S.Titulo
      ORDER BY S.Numero_Semana, A.Id_Actividad
    `;

    return await this.apiService.postRecord(sql);
  }

  async cargarEntregasActividad(Id_Actividad, Id_Grupo){
    const sql = `
      SELECT
        EA.Id_Entrega,
        EA.Id_Actividad,
        EA.Id_Usuario,
        EA.Url,
        EA.Nota,
        EA.Comentario_Docente,
        EA.Creado_El,
        estudiante.Nombre AS Estudiante,
        MD.Id_Matricula_Detalle
      FROM Lms_EntregaActividad EA
      INNER JOIN Gen_Persona estudiante
        ON estudiante.Id_Usuario = EA.Id_Usuario
        AND estudiante.Id_Empresa = EA.Id_Empresa
      INNER JOIN Edu_Matricula M
        ON M.Id_Persona = estudiante.Id_Persona
        AND M.Id_Empresa = EA.Id_Empresa
      INNER JOIN Edu_Matricula_Detalle MD
        ON MD.Id_Matricula = M.Id_Matricula
      WHERE EA.Id_Actividad = ${Number(Id_Actividad)}
        AND MD.Id_Grupo = ${Number(Id_Grupo)}
        AND EA.Id_Empresa = ${localStorage.getItem('Id_Empresa')}
      ORDER BY EA.Creado_El DESC
    `;

    return await this.apiService.postRecord(sql);
  }

  async actualizarEntrega(entrega){
    const nota = entrega.Nota === null || entrega.Nota === undefined || entrega.Nota === ''
      ? 'NULL'
      : Number(entrega.Nota);
    const comentario = this.normalizarTexto(entrega.Comentario_Docente);

    let sqlConfig = {
      table: 'Lms_EntregaActividad',
      fields: 'Nota=' + nota + ',Comentario_Docente=\'' + comentario + '\'',
      where: 'Id_Entrega=' + entrega.Id_Entrega
    };

    return await this.apiService.updateRecord(sqlConfig);
  }

  async aplicarNotasLmsAlActa(Id_Grupo){
    const sql = `
      SELECT
        MD.Id_Matricula_Detalle,
        ROUND(AVG(EA.Nota), 2) AS PromedioLms
      FROM Edu_Matricula_Detalle MD
      INNER JOIN Edu_Matricula M
        ON M.Id_Matricula = MD.Id_Matricula
      INNER JOIN Gen_Persona estudiante
        ON estudiante.Id_Persona = M.Id_Persona
      INNER JOIN Lms_AulaVirtual AV
        ON AV.Id_Grupo = MD.Id_Grupo
      INNER JOIN Lms_SemanaCurso S
        ON S.Id_AulaVirtual = AV.Id_AulaVirtual
      INNER JOIN Lms_Actividad A
        ON A.Id_Semana = S.Id_Semana
        AND A.Tipo <> '3'
      INNER JOIN Lms_EntregaActividad EA
        ON EA.Id_Actividad = A.Id_Actividad
        AND EA.Id_Usuario = estudiante.Id_Usuario
        AND EA.Id_Empresa = M.Id_Empresa
      WHERE MD.Id_Grupo = ${Number(Id_Grupo)}
        AND M.Id_Empresa = ${localStorage.getItem('Id_Empresa')}
        AND EA.Nota IS NOT NULL
      GROUP BY MD.Id_Matricula_Detalle
    `;

    const data = await this.apiService.postRecord(sql);
    const registros = data?.['data'] || [];

    for (const registro of registros) {
      const promedio = Number(registro.PromedioLms || 0);
      const estado = promedio >= 70 ? '2' : '3';
      await this.apiService.updateRecord({
        table: 'Edu_Matricula_Detalle',
        fields: 'Rubrica_1=\'' + promedio + '\',Rubrica_2=\'0\',Rubrica_3=\'0\',Rubrica_4=\'0\',Rubrica_5=\'0\',Promedio=\'' + promedio + '\',Estado=\'' + estado + '\'',
        where: 'Id_Matricula_Detalle=' + registro.Id_Matricula_Detalle
      });
    }

    return {
      success: 'true',
      total: registros.length,
      data: registros
    };
  }

  private normalizarTexto(valor){
    return String(valor || '').replace(/'/g, ' ');
  }
}
