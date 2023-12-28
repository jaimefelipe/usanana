import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodoContableService {

  constructor(private apiService: ApiService) {}
  async loadPeriodos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Cge_Periodo_Contable',
      fields: 'Id_Periodo_Contable,Mes,Anio,Desde,Hasta,Estado,Secuencia',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadPeriodo(Id_Periodo_Contable) {
    let sqlConfig = {
      table: 'Cge_Periodo_Contable',
      fields: 'Id_Periodo_Contable,Mes,Anio,Desde,Hasta,Estado,Secuencia',
      where: 'Id_Periodo_Contable='+Id_Periodo_Contable
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async savePeriodo(Periodo){
    if(Periodo.Id_Periodo_Contable == ""){
      let sql = {
        table: 'Cge_Periodo_Contable',
        fields: 'Mes,Anio,Desde,Hasta,Estado,Secuencia',
        values: '\'' + Periodo.Mes
        + '\',\'' + Periodo.Anio
        + '\',\'' + Periodo.Desde
        + '\',\'' + Periodo.Hasta
        + '\',\'' + Periodo.Estado
        + '\',\'' + Periodo.Secuencia
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Cge_Periodo_Contable',
        fields: 'Mes=\'' + Periodo.Mes
        + '\',Anio=\'' + Periodo.Anio
        + '\',Desde=\'' + Periodo.Desde
        + '\',Hasta=\'' + Periodo.Hasta
        + '\',Estado=\''+ Periodo.Estado
        + '\',Secuencia=\''+ Periodo.Secuencia
         + '\'',
        where: 'Id_Periodo_Contable=' + Periodo.Id_Periodo_Contable
      };
      return await this.apiService.updateRecord(sql);
    }
  }
}
