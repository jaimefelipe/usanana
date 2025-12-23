import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoAcademicoService {

  constructor(private apiService: ApiService) {}
  async loadGrupos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Edu_Grupo Edu_Grupo left join Edu_Curso on Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso left Join Gen_Persona on Edu_Grupo.Id_Profesor = Gen_Persona.Id_Persona left Join Edu_Periodo_Academico on Edu_Grupo.Id_Periodo = Edu_Periodo_Academico.Id_Periodo_Academico left join Gen_Sucursal on Edu_Grupo.Id_Sucursal =  Gen_Sucursal.Id_Sucursal',
      fields: 'Id_Grupo,Edu_Grupo.Nombre,Aula,Dia,Hora,Modalidad,Edu_Grupo.Estado,Edu_Curso.Curso,Gen_Persona.Nombre as Profesor, Edu_Periodo_Academico.Bloque,Edu_Periodo_Academico.Anio, Gen_Sucursal.Nombre as Sucursal, Edu_Curso.Codigo',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadGrupo(Id_Grupo) {
    let sqlConfig = {
      table: 'Edu_Grupo left join Edu_Curso on Edu_Grupo.Id_Curso = Edu_Curso.Id_Curso left Join Gen_Persona on Edu_Grupo.Id_Profesor = Gen_Persona.Id_Persona',
      fields: 'Id_Grupo,Id_Sucursal,Id_Periodo,Edu_Grupo.Nombre,Aula,Id_Profesor,Edu_Grupo.Id_Curso,Id_Grupo,Dia,Hora,Modalidad,Edu_Grupo.Estado,Edu_Curso.Curso,Gen_Persona.Nombre as Profesor',
      where: 'Id_Grupo='+Id_Grupo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveGrupo(Grupo){
    if(Grupo.Id_Grupo == ""){
      let sql = {
        table: 'Edu_Grupo',
        fields: 'Id_Sucursal,Nombre,Aula,Id_Profesor,Id_Curso,Id_Periodo,Dia,Hora,Modalidad,Estado',
        values: '\'' + Grupo.Id_Sucursal
        + '\',\'' + Grupo.Nombre
        + '\',\'' + Grupo.Aula
        + '\',\'' + Grupo.Id_Profesor
        + '\',\'' + Grupo.Id_Curso
        + '\',\'' + Grupo.Id_Periodo
        + '\',\'' + Grupo.Dia
        + '\',\'' + Grupo.Hora
        + '\',\'' + Grupo.Modalidad
        + '\',\'' + Grupo.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Edu_Grupo',
        fields: 'Id_Sucursal=\'' + Grupo.Id_Sucursal
        + '\',Nombre=\'' + Grupo.Nombre
        + '\',Aula=\'' + Grupo.Aula
        + '\',Id_Profesor=\'' + Grupo.Id_Profesor
        + '\',Id_Curso=\'' + Grupo.Id_Curso
        + '\',Id_Periodo=\'' + Grupo.Id_Periodo
        + '\',Dia=\'' + Grupo.Dia
        + '\',Hora=\'' + Grupo.Hora
        + '\',Modalidad=\'' + Grupo.Modalidad
        + '\',Estado=\''+ Grupo.Estado  + '\'',
        where: 'Id_Grupo=' + Grupo.Id_Grupo
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
