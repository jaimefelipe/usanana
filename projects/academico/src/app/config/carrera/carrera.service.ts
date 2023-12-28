import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor(private apiService: ApiService) { }

  async cargarCarreras(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Edu_Carrera',
      fields: 'Id_Carrera,Codigo,Carrera,Nivel,Estado',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarCarrera(Id_Carrera){
    let sqlConfig = {
      table: 'Edu_Carrera',
      fields: 'Id_Carrera,Codigo,Carrera,Descripcion,Requisito,Duracion,Nivel,Estado',
      where: 'Id_Carrera='+Id_Carrera
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async InsertarCarrera(Carrera){
    let sql = {
      table: 'Edu_Carrera',
      fields: 'Codigo,Carrera,Descripcion,Requisito,Duracion,Nivel,Estado',
      values: '\'' + Carrera.Codigo
      + '\',\'' + Carrera.Carrera
      + '\',\'' + Carrera.Descripcion
      + '\',\'' + Carrera.Requisito
      + '\',\'' + Carrera.Duracion
      + '\',\'' + Carrera.Nivel
      + '\',\'' + Carrera.Estado + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async ActualizarCarrera(Carrera){
    let sql = {
      table: 'Edu_Carrera',
      fields: 'Codigo=\'' + Carrera.Codigo
      + '\',Carrera=\'' + Carrera.Carrera
      + '\',Descripcion=\'' + Carrera.Descripcion
      + '\',Requisito=\'' + Carrera.Requisito
      + '\',Duracion=\'' + Carrera.Duracion
      + '\',Nivel=\'' + Carrera.Nivel
      + '\',Estado=\''+ Carrera.Estado  + '\'',
      where: 'Id_Carrera=' + Carrera.Id_Carrera
    };
    return await this.apiService.updateRecord(sql);
  }

  async CargarCursosCarrera(Id_Carrera,paginacion,search?){

    let sqlConfig = {
      table: 'Edu_Curso_Carrera inner Join Edu_Curso on Edu_Curso_Carrera.Id_Curso = Edu_Curso.Id_Curso',
      fields: 'Id_Curso_Carrera,Edu_Curso_Carrera.Id_Curso,Bloque, Codigo, Curso',
      searchField: search,
      paginacion: paginacion,
      where:"Id_Carrera =" + Id_Carrera
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarCurso(Id_Curso){
    let sqlConfig = {
      table: 'Edu_Curso_Carrera inner Join Edu_Curso on Edu_Curso_Carrera.Id_Curso = Edu_Curso.Id_Curso',
      fields: 'Id_Curso_Carrera,Edu_Curso_Carrera.Id_Curso,Bloque, Codigo, Curso',
      where: 'Edu_Curso_Carrera.Id_Curso='+Id_Curso
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarCursosDisponibles(paginacion,search?,Estado?) {
    let estado = ' Edu_Curso_Carrera.id_curso IS NULL '
    if(Estado == 1 || Estado == 0){
      estado = ' and Estado ='+ Estado;
    }
    
    let sqlConfig = {
      table: 'Edu_Curso LEFT JOIN Edu_Curso_Carrera ON Edu_Curso.Id_Curso = Edu_Curso_Carrera.Id_Curso',
      fields: "Edu_Curso.Id_Curso,Codigo,Curso,'' as Id_Curso_Carrera",
      searchField: search,
      paginacion: paginacion,
      where:estado
    }

    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async InsertarCursoCarrera(Carrera){
    let sql = {
      table: 'Edu_Curso_Carrera',
      fields: 'Id_Carrera,Id_Curso,Bloque',
      values: '\'' + Carrera.Id_Carrera
      + '\',\'' + Carrera.Id_Curso
      + '\',\'' + Carrera.Bloque + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async ActualizarCarreraCurso(Carrera){
    let sql = {
      table: 'Edu_Curso_Carrera',
      fields: 'Id_Curso=\'' + Carrera.Id_Curso
      + '\',Bloque=\''+ Carrera.Bloque  + '\'',
      where: 'Id_Curso_Carrera=' + Carrera.Id_Curso_Carrera
    };
    return await this.apiService.updateRecord(sql);
  }
}
