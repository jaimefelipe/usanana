import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  constructor(private apiService: ApiService) {}

  async loadTipos(paginacion,search?) {
    let sqlConfig = {
      table: 'Tra_Tipo_Vehiculo',
      fields: 'Id_Tipo_Vehiculo,Tipo',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveTipo(tipo){
    if(tipo.Id_Categoria_Vehiculo ==""){
      let sql = {
        table: 'Tra_Tipo_Vehiculo',
        fields: 'Tipo',
        values: '\'' + tipo.Tipo
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Tra_Tipo_Vehiculo',
        fields: 'Tipo=\'' + tipo.Tipo
        + '\'',
        where: 'Id_Tipo_Vehiculo=' + tipo.Id_Tipo_Vehiculo
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadTipo(Id_Tipo_Vehiculo){
    let sqlConfig = {
      table: 'Tra_Tipo_Vehiculo',
      fields: 'Id_Tipo_Vehiculo,Tipo',
      orderField: '',
      searchField: '',
      where: "Id_Tipo_Vehiculo = " + Id_Tipo_Vehiculo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
