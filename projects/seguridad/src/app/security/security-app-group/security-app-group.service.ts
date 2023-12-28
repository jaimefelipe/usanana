import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class SecurityAppGroupService {

  constructor(private apiService: ApiService) {}

  async loadAppGrupos(paginacion,search?) {
    let sqlConfig = {
      table: 'App_Grupo Inner Join App On App_Grupo.Id_App = App.Id_App inner Join Seg_Grupo on App_Grupo.Id_Grupo = Seg_Grupo.Id_Grupo',
      fields: 'Id_App_Grupo,App_Grupo.Id_App,App_Grupo.Id_Grupo,Editar,Agregar,App_Grupo.Estado, Titulo, Principal,Seg_Grupo.Nombre',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    let data = await this.apiService.executeSqlSyn(sqlConfig);
    return data;
  }
  async saveAppGrupo(Grupo){
    if(Grupo.Id_App_Grupo ==""){
      let sql = {
        table: 'App_Grupo',
        fields: 'Id_App,Id_Grupo,Editar,Agregar,Estado',
        values:  '\'' + Grupo.Id_App
        + '\',\''  + Grupo.Id_Grupo
        + '\',\''  + Grupo.Editar
        + '\',\''  + Grupo.Agregar
        + '\',\'' + Grupo.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'App_Grupo',
        fields: 'Id_App=\'' + Grupo.Id_App
        + '\',Id_Grupo=\''+ Grupo.Id_Grupo
        + '\',Editar=\''+ Grupo.Editar
        + '\',Agregar=\''+ Grupo.Agregar
        + '\',Estado=\''+ Grupo.Estado  + '\'',
        where: 'Id_App_Grupo=' + Grupo.Id_App_Grupo
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadAppGrupo(Id_App_Grupo){
    let sqlConfig = {
      table: 'App_Grupo Inner Join App On App_Grupo.Id_App = App.Id_App inner Join Seg_Grupo on App_Grupo.ID_Grupo = Seg_Grupo.Id_Grupo',
      fields: 'Id_App_Grupo,App_Grupo.Id_App,App_Grupo.Id_Grupo,Editar,Agregar,App_Grupo.Estado, Titulo, Seg_Grupo.Nombre ',
      orderField: '',
      searchField: '',
      where: "Id_App_Grupo = " + Id_App_Grupo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
