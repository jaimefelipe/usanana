import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';


@Injectable({
  providedIn: 'root'
})
export class PuestoService {


  constructor(private apiService: ApiService) {}
  async loadPuestos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Rhh_Puesto',
      fields: 'Id_Puesto,Puesto',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadPuesto(Id_Puesto) {
    let sqlConfig = {
      table: 'Rhh_Puesto',
      fields: 'Id_Puesto,Puesto',
      where: 'Id_Puesto='+Id_Puesto
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async savePuesto(Puesto){
    if(Puesto.Id_Puesto == ""){
      let sql = {
        table: 'Rhh_Puesto',
        fields: 'Puesto',
        values: '\'' + Puesto.Puesto
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Rhh_Puesto',
        fields: 'Puesto=\'' + Puesto.Puesto
         + '\'',
        where: 'Id_Puesto=' + Puesto.Id_Puesto
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
