import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private apiService: ApiService) {}

  async loadSucursales(paginacion,search?) {
    let sqlConfig = {
      table: 'Gen_Sucursal',
      fields: 'Id_Sucursal,Nombre',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadProvinces(){
    let sql = "Select Distinct Provincia,Provincia_Nombre from Division_Geografica order by Provincia";
    return await this.apiService.postRecord(sql);
  }
  async LoadCantons(Province){
    let sql = "Select Distinct Canton,Canton_Nombre from Division_Geografica where Provincia = " + Province + " order by Canton";
    return await this.apiService.postRecord(sql);
  }
  async LoadDistrito(Province,Canton){
    let sql = "Select Distinct Distrito,Distrito_Nombre from Division_Geografica where Provincia = " + Province + " and Canton = "+Canton+" order by Distrito";
    return await this.apiService.postRecord(sql);
  }
}
