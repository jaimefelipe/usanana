import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private apiService: ApiService) { }

  async cargarCursos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Edu_Curso',
      fields: 'Id_Curso,Codigo,Curso,Estado',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarCurso(Id_Curso){
    let sqlConfig = {
      table: 'Edu_Curso',
      fields: 'Id_Curso,Codigo,Curso,Descripcion,Requisitos,Estado',
      where: 'Id_Curso='+Id_Curso
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async InsertarCurso(Curso){
    let sql = {
      table: 'Edu_Curso',
      fields: 'Codigo,Curso,Descripcion,Requisitos,Estado',
      values: '\'' + Curso.Codigo
      + '\',\'' + Curso.Curso
      + '\',\'' + Curso.Descripcion
      + '\',\'' + Curso.Requisitos
      + '\',\'' + Curso.Estado + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async ActualizarCurso(Curso){
    let sql = {
      table: 'Edu_Curso',
      fields: 'Codigo=\'' + Curso.Codigo
      + '\',Curso=\'' + Curso.Curso
      + '\',Descripcion=\'' + Curso.Descripcion
      + '\',Requisitos=\'' + Curso.Requisitos
      + '\',Estado=\''+ Curso.Estado  + '\'',
      where: 'Id_Curso=' + Curso.Id_Curso
    };
    return await this.apiService.updateRecord(sql);
  }


  async LeerCursosEstudiantes(registro){
    let sqlConfig = {
      table: 'Edu_Curso INNER JOIN Edu_Grupo ON Edu_Curso.Id_Curso = Edu_Grupo.Id_Curso INNER JOIN Edu_Matricula_Detalle INNER JOIN Edu_Matricula ON Edu_Matricula_Detalle.Id_Matricula = Edu_Matricula.Id_Matricula ON Edu_Grupo.Id_Grupo = Edu_Matricula_Detalle.Id_Grupo INNER JOIN Edu_Curso_Carrera ON Edu_Curso.Id_Curso = Edu_Curso_Carrera.Id_Curso INNER JOIN Edu_Carrera ON Edu_Curso_Carrera.Id_Carrera = Edu_Carrera.Id_Carrera',
      fields: 'Edu_Matricula_Detalle.Id_Matricula_Detalle, Edu_Matricula_Detalle.Id_Empresa, Edu_Matricula_Detalle.Id_Matricula, Edu_Matricula_Detalle.Id_Grupo, Edu_Matricula_Detalle.Promedio, Edu_Matricula_Detalle.Estado, Edu_Matricula.Id_Persona, Edu_Matricula.Id_Periodo, Edu_Curso.Codigo, Edu_Curso.Curso,Edu_Carrera.Codigo AS Carrera',
      where: 'Id_Persona=' + registro,
      orderField: '',
      searchField: ''
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  
  async leerCursosPendientes(registro){
   
      let sqlConfig = {
        // tslint:disable-next-line: max-line-length
        table: 'Gen_Persona INNER JOIN Edu_Carrera_Estudiante ON Gen_Persona.Id_Persona = Edu_Carrera_Estudiante.Id_Persona INNER JOIN Edu_Carrera ON Edu_Carrera_Estudiante.Id_Carrera = Edu_Carrera.Id_Carrera INNER JOIN Edu_Curso_Carrera ON Edu_Carrera.Id_Carrera = Edu_Curso_Carrera.Id_Carrera INNER JOIN Edu_Curso ON Edu_Curso_Carrera.Id_Curso = Edu_Curso.Id_Curso ',
        fields: 'Edu_Carrera.Codigo, Edu_Carrera.Carrera, Edu_Curso.Codigo AS CodigoCurso, Edu_Curso.Curso',
        // tslint:disable-next-line: max-line-length
        where:  '(Gen_Persona.Id_Persona = ' + registro + ') and Edu_Curso.Id_Curso  not in ( SELECT Edu_Grupo.Id_Curso FROM Gen_Persona INNER JOIN Edu_Matricula ON Gen_Persona.Id_Persona = Edu_Matricula.Id_Persona INNER JOIN Edu_Matricula_Detalle ON Edu_Matricula.Id_Matricula = Edu_Matricula_Detalle.Id_Matricula INNER JOIN Edu_Grupo ON Edu_Matricula_Detalle.Id_Grupo = Edu_Grupo.Id_Grupo INNER JOIN Edu_Curso ON Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso WHERE (Gen_Persona.Id_Persona = ' + registro + ') and Edu_Matricula_Detalle.Estado = 2)',
        orderField: '',
        searchField: '',
        simple: true
      };
      return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerCursosPorNivel(Nivel){
    let sqlConfig = {
      table: 'Edu_Carrera',
      fields: 'Id_Carrera, Carrera',
      orderField: '',
      searchField: '',
      simple:true,
      where: 'Estado = 1 and Nivel = ' + Nivel
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
