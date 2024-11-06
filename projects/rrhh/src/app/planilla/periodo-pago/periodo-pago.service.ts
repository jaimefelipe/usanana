import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class PeriodoPagoService {
  constructor(private apiService: ApiService) {}
  async loadPeriodos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Pl_Periodo_Pago',
      fields: 'Id_Periodo_Pago,Nombre,Horas_Periodo',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCentro(Id_Periodo_Pago) {
    let sqlConfig = {
      table: 'Pl_Periodo_Pago',
      fields: 'Id_Periodo_Pago,Nombre,Horas_Periodo',
      where: 'Id_Periodo_Pago='+Id_Periodo_Pago
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async savePeriodo(Periodo){
    if(Periodo.Id_Periodo_Pago == ""){
      let sql = {
        table: 'Pl_Periodo_Pago',
        fields: 'Nombre,Horas_Periodo',
        values: '\'' + Periodo.Nombre + '\','
        + '\'' + Periodo.Horas_Periodo
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Pl_Periodo_Pago',
        fields: 'Nombre=\'' + Periodo.Nombre + '\','
        + 'Horas_Periodo=\'' + Periodo.Horas_Periodo
         + '\'',
        where: 'Id_Periodo_Pago=' + Periodo.Id_Periodo_Pago
      };
      return await this.apiService.updateRecord(sql);
    }
  }
 
}
