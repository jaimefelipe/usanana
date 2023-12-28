import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class CentroCostoService {

  constructor(private apiService: ApiService) {}
  async loadCentros(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Cge_Centro_Costo',
      fields: 'Id_Centro_Costo,Nombre',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCentro(Id_Centro_Costo) {
    let sqlConfig = {
      table: 'Cge_Centro_Costo',
      fields: 'Id_Centro_Costo,Nombre',
      where: 'Id_Centro_Costo='+Id_Centro_Costo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveCentro(Centro){
    if(Centro.Id_Centro_Costo == ""){
      let sql = {
        table: 'Cge_Centro_Costo',
        fields: 'Nombre',
        values: '\'' + Centro.Nombre
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Cge_Centro_Costo',
        fields: 'Nombre=\'' + Centro.Nombre
         + '\'',
        where: 'Id_Centro_Costo=' + Centro.Id_Centro_Costo
      };
      return await this.apiService.updateRecord(sql);
    }
  }
}
