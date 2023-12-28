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
}
