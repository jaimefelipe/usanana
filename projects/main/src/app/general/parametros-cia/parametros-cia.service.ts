import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosCiaService {
  constructor(private apiService: ApiService) {}

  async loadParameters(paginacion,search?) {
    let sqlConfig = {
      table: 'Gen_Parametros_Compania inner join Gen_Empresa on Gen_Parametros_Compania.Id_Empresa = Gen_Empresa.Id_Empresa',
      fields: 'Gen_Parametros_Compania.Id_Empresa,Id_Gen_Parametros_Compania,Parametro,Valor,Nombre',
      orderField: '',
      Empresa:false,
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveParameter(Parameter){
    if(Parameter.Id_Gen_Parametros_Compania ==""){
      let sql = {
        table: 'Gen_Parametros_Compania',
        Empresa:false,
        fields: 'Parametro,Id_Empresa,Valor',
        values: '\'' + Parameter.Parametro
        + '\',\'' + Parameter.Id_Empresa
        + '\',\'' + Parameter.Valor + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Gen_Parametros_Compania',
        Empresa:false,
        fields: 'Parametro=\'' + Parameter.Parametro
        + '\',Id_Empresa=\''+ Parameter.Id_Empresa
        + '\',Valor=\''+ Parameter.Valor  + '\'',
        where: 'Id_Gen_Parametros_Compania=' + Parameter.Id_Gen_Parametros_Compania
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadParameter(Id_Parameter){
    let sqlConfig = {
      table: 'Gen_Parametros_Compania',
      fields: 'Id_Empresa,Id_Gen_Parametros_Compania,Parametro,Valor',
      Empresa:false,
      where: "Id_Gen_Parametros_Compania = " + Id_Parameter
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadParameterCia(Id_Empresa,Parametro){
    let sqlConfig = {
      table: 'Gen_Parametros_Compania',
      fields: 'Id_Empresa,Id_Gen_Parametros_Compania,Parametro,Valor',
      Empresa:false,
      where: "Parametro = '" + Parametro + "' and Id_Empresa = " + Id_Empresa
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
