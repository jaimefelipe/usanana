import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class SecurityUserGroupService {

  constructor(private apiService: ApiService) {}

  async loadUserGrupos(paginacion,search?) {
    let sqlConfig = {
      table: 'Seg_Usuario_Grupo inner join Seg_Usuario on Seg_Usuario_Grupo.Id_Usuario = Seg_Usuario.Id_Usuario inner join Seg_Grupo on Seg_Usuario_Grupo.Id_Grupo = Seg_Grupo.Id_Grupo',
      fields: 'Id_Usuario_Grupo,Seg_Usuario_Grupo.Id_Grupo,Seg_Usuario_Grupo.Estado,Seg_Usuario.Nombre,Seg_Grupo.Nombre as Grupo',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    let data = await this.apiService.executeSqlSyn(sqlConfig);
    return data;
  }
  async loadUserGrupo(Id_Usuario_Grupo){
    let sqlConfig = {
      table: 'Seg_Usuario_Grupo Inner Join Seg_Grupo On Seg_Usuario_Grupo.Id_Grupo = Seg_Grupo.Id_Grupo inner Join Seg_Usuario on Seg_Usuario_Grupo.Id_Usuario = Seg_Usuario.Id_Usuario',
      fields: 'Id_Usuario_Grupo,Seg_Usuario_Grupo.Id_Usuario,Seg_Usuario_Grupo.Id_Grupo,Seg_Usuario_Grupo.Estado, Seg_Usuario.Nombre as Usuario, Seg_Grupo.Nombre as Grupo',
      orderField: '',
      searchField: '',
      where: "Id_Usuario_Grupo = " + Id_Usuario_Grupo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveUserGrupo(Grupo){
    if(Grupo.Id_Usuario_Grupo ==""){
      let sql = {
        table: 'Seg_Usuario_Grupo',
        fields: 'Id_Usuario,Id_Grupo,Estado',
        values:  '\'' + Grupo.Id_Usuario
        + '\',\''  + Grupo.Id_Grupo
        + '\',\'' + Grupo.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Seg_Usuario_Grupo',
        fields: 'Id_Usuario=\'' + Grupo.Id_Usuario
        + '\',Id_Grupo=\''+ Grupo.Id_Grupo
        + '\',Estado=\''+ Grupo.Estado  + '\'',
        where: 'Id_Usuario_Grupo=' + Grupo.Id_Usuario_Grupo
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
