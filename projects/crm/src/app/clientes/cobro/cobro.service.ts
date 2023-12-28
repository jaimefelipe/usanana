import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CobroService {

  constructor(private apiService: ApiService) {}

  async loadCobros(paginacion,search?,Estado?,Id_Persona?) {
    let sqlConfig = {
      table: 'Gen_Cobro',
      fields: 'Id_Cobro,Id_Persona,Monto,Detalle,Creado_El,Creado_Por',
      searchField: search,
      paginacion: paginacion,
      where :'Id_Persona='+Id_Persona
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async NuevoCobro(Cobro){
    let sql = {
      table: 'Gen_Cobro',
      fields: 'Id_Persona,Monto,Detalle',
      values: '\'' + Cobro.Id_Persona
      + '\',\'' + Cobro.Monto
      + '\',\'' + Cobro.Detalle
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async UpdateCobro(Cobro){
    let sql = {
      table: 'Gen_Cobro',
      fields: 'Id_Persona=\'' + Cobro.Id_Persona
      + '\',Monto=\'' + Cobro.Monto
      + '\',Detalle=\'' + Cobro.Detalle
       + '\'',
      where: 'Id_Cobro=' + Cobro.Id_Cobro
    };
    return await this.apiService.updateRecord(sql);
  }
}
