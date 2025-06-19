import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TipoPlanillaService {

  constructor(private apiService: ApiService) {}
  async loadTipos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Pl_Tipo_Planilla',
      fields: 'Id_Tipo_Planilla,Nombre,Id_Periodo_Pago,Metodo_Calculo_Salario',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadTipo(Id_Tipo_Planilla) {
    let sqlConfig = {
      table: 'Pl_Tipo_Planilla',
      fields: 'Id_Tipo_Planilla,Nombre,Id_Periodo_Pago,Metodo_Calculo_Salario',
      where: 'Id_Tipo_Planilla='+Id_Tipo_Planilla
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveTipo(Tipo){
    if(Tipo.Id_Tipo_Planilla == ""){
      let sql = {
        table: 'Pl_Tipo_Planilla',
        fields: 'Nombre,Id_Periodo_Pago,Metodo_Calculo_Salario',
        values: '\'' + Tipo.Nombre + '\','
        + '\'' + Tipo.Id_Periodo_Pago
        + '\'' + Tipo.Metodo_Calculo_Salario
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Pl_Tipo_Planilla',
        fields: 'Nombre=\'' + Tipo.Nombre + '\','
        + 'Id_Periodo_Pago=\'' + Tipo.Id_Periodo_Pago
        + '\',Metodo_Calculo_Salario=\'' + Tipo.Metodo_Calculo_Salario
        + '\'',
        where: 'Id_Tipo_Planilla=' + Tipo.Id_Tipo_Planilla
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
