
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsecutivoService {

  constructor(private apiService: ApiService) {}
  async getConsecutivos(paginacion?,search?){
    let sqlConfig = {
      table: 'Ven_Caja INNER JOIN Gen_Empresa On Ven_Caja.Id_Empresa = Gen_Empresa.Id_Empresa',
      fields: 'Ven_Caja.Id_Caja,Ven_Caja.Id_Empresa, Gen_Empresa.Nombre, Id_Sucursal,Numero_Caja,Consecutivo',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      Empresa:false
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async setConsecutivo(Consecutivo,Caja){
    let sql = "Update Ven_Caja Set Consecutivo = '"+ Consecutivo +"' where Id_Caja  = '"+ Caja + "'";
    return await this.apiService.postRecord(sql);
  }
}
