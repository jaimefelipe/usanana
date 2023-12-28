import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {

constructor(private apiService:ApiService) { }

  async cargarMatriculas(paginacion,search?) {

    let sqlConfig = {
      table: 'Edu_Matricula Inner Join Edu_Periodo_Academico on Edu_Matricula.Id_Periodo = Edu_Periodo_Academico.Id_Periodo_Academico inner Join Gen_Persona on Edu_Matricula.Id_Persona = Gen_Persona.Id_Persona',
      fields: 'Id_Matricula,Bloque,Anio,Nombre',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarMatricula(Id_Matricula){
    let sqlConfig = {
      table: 'Edu_Matricula Inner Join Edu_Periodo_Academico on Edu_Matricula.Id_Periodo = Edu_Periodo_Academico.Id_Periodo_Academico inner Join Gen_Persona on Edu_Matricula.Id_Persona = Gen_Persona.Id_Persona',
      fields: 'Id_Matricula,Edu_Matricula.Id_Persona,Bloque,Id_Periodo,Anio,Nombre',
      where: 'Id_Matricula = ' + Id_Matricula
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarMatriculaDetalle(Id_Matricula){
    let sqlConfig = {
      table: 'Edu_Matricula_Detalle inner join Edu_Grupo on Edu_Matricula_Detalle.Id_Grupo = Edu_Grupo.Id_Grupo inner join Edu_Curso on Edu_Curso.Id_Curso = Edu_Grupo.Id_Curso',
      fields: 'Id_Matricula_Detalle,Edu_Matricula_Detalle.Id_Grupo,Promedio,Edu_Matricula_Detalle.Estado,Edu_Curso.Curso, Dia,Hora,Modalidad',
      where: 'Id_Matricula = ' + Id_Matricula
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }
  async NuevaMatricula(Matricula){
    let sql = {
      table: 'Edu_Matricula',
      fields: 'Id_Persona,Id_Periodo',
      values: '\'' + Matricula.Id_Persona
      + '\',\'' + Matricula.Id_Periodo
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async ActualizarMatricual(Matricula){
    let sql = {
      table: 'Edu_Matricula',
      fields: 'Id_Persona=\'' + Matricula.Id_Persona
      + '\',Id_Periodo=\'' + Matricula.Id_Periodo
      + '\'',
      where: 'Id_Matricula=' + Matricula.Id_Matricula
    };
    return await this.apiService.updateRecord(sql);
  }

  async cargarCursosDisponibles(Id_Persona,Id_Periodo) {
    let sql = `Select Edu_Grupo.Id_Grupo,Edu_Grupo.Nombre as Grupo,Edu_Grupo.Aula,Edu_Grupo.Dia,Edu_Grupo.Hora,Edu_Grupo.Modalidad, Gen_Persona.Nombre as Profesor,
    Edu_Curso.Codigo,Edu_Curso.Id_Curso, Curso, Edu_Curso_Carrera.Bloque,Edu_Curso_Carrera.Id_Carrera
    From Edu_Grupo
    Inner Join Edu_Curso On Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso
    inner join Gen_Persona on Gen_Persona.Id_Persona = Edu_Grupo.Id_Profesor
    Inner join Edu_Curso_Carrera On Edu_Curso.Id_Curso = Edu_Curso_Carrera.Id_Curso
    Inner join Edu_Carrera_Estudiante On Edu_Curso_Carrera.Id_Carrera = Edu_Carrera_Estudiante.Id_Carrera
    where Edu_Grupo.Id_Empresa = ` + localStorage.getItem('Id_Empresa') + `
    and Edu_Grupo.Estado = 1 and Id_Periodo = `+ Id_Periodo + `
    and Edu_Carrera_Estudiante.Id_Persona = `+ Id_Persona + `
        and Edu_Curso.Id_Curso not in (
        Select Edu_Grupo.Id_Curso
        From Edu_Matricula_Detalle
        inner join Edu_Matricula On Edu_Matricula_Detalle.Id_Matricula = Edu_Matricula.Id_Matricula
        inner Join Edu_Grupo On Edu_Matricula_Detalle.Id_Grupo = Edu_Grupo.Id_Grupo
        where Id_Persona = `+ Id_Persona + ` and ( Edu_Matricula_Detalle.Estado = 2 or Edu_Matricula_Detalle.Estado = 1 or Edu_Matricula_Detalle.Estado = 4));`;

    return await this.apiService.postRecord(sql);
  }
  async CargarDetalle(Id_Matricula_Detalle){
    let sqlConfig = {
      table: 'Edu_Matricula_Detalle',
      fields: 'Id_Matricula_Detalle,Estado,Rubrica_1,Rubrica_2,Rubrica_3,Rubrica_4,Rubrica_5,Promedio,Notas',
      where: 'Id_Matricula_Detalle = ' + Id_Matricula_Detalle
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }
  async grabarMatriculaDetalle(Id_Matricula,Id_Grupo){
      let sql = {
        table: 'Edu_Matricula_Detalle',
        fields: 'Id_Matricula,Id_Grupo,Estado',
        values: '\'' + Id_Matricula
        + '\',\'' + Id_Grupo
        + '\',\'1\''
      };
      return await this.apiService.insertRecord(sql);
  }
  async updateMatriculaDetalle(Id_Matricula_Detalle,Estado,Notas){
    let sql = {
      table: 'Edu_Matricula_Detalle',
      fields: 'Estado=\'' + Estado
      + '\',Notas=\'' + Notas
      + '\'',
      where: 'Id_Matricula_Detalle=' + Id_Matricula_Detalle
    };
    return await this.apiService.updateRecord(sql);
}

}
