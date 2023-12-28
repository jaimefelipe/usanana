import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityGroupService {

  constructor(private apiService: ApiService) {}

  async loadGrupos(paginacion,search?) {
    let sqlConfig = {
      table: 'Seg_Grupo',
      fields: 'Id_Grupo,Nombre,Estado',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveGrupo(Grupo){
    if(Grupo.Id_Grupo ==""){
      let sql = {
        table: 'Seg_Grupo',
        fields: 'Nombre,Estado',
        values: '\'' + Grupo.Nombre
        + '\',\'' + Grupo.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Seg_Grupo',
        fields: 'Nombre=\'' + Grupo.Nombre
        + '\',Estado=\''+ Grupo.Estado  + '\'',
        where: 'Id_Grupo=' + Grupo.Id_Grupo
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadGrupo(Id_Grupo){
    let sqlConfig = {
      table: 'Seg_Grupo',
      fields: 'Id_Grupo,Nombre,Estado',
      orderField: '',
      searchField: '',
      where: "Id_Grupo = " + Id_Grupo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
