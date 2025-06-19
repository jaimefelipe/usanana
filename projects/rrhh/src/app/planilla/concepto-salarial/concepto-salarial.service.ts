import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConceptoSalarialService {

  constructor(private apiService: ApiService) {}
  async loadConceptos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Pl_Concepto_Salarial',
      fields: 'Id_Concepto_Salarial,Nombre,Estado',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCentro(Id_Concepto_Salarial) {
    let sqlConfig = {
      table: 'Pl_Concepto_Salarial',
      fields: 'Id_Concepto_Salarial,Nombre,Tipo_Concepto,Aplica_Como,Tipo_Referencia,Tipo_Valor,Aplica_Calculos,Estado,Secuencia,Valor,Formula,Etiqueta',
      where: 'Id_Concepto_Salarial='+Id_Concepto_Salarial
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async savePeriodo(Periodo){
    if(Periodo.Id_Concepto_Salarial == ""){
      let sql = {
        table: 'Pl_Concepto_Salarial',
        fields: 'Nombre,Tipo_Concepto,Aplica_Como,Tipo_Referencia,Tipo_Valor,Aplica_Calculos,Estado,Secuencia,Valor,Formula,Etiqueta',
        values: '\'' + Periodo.Nombre  + '\','
        + '\'' + Periodo.Tipo_Concepto + '\','
        + '\'' + Periodo.Aplica_Como + '\','
        + '\'' + Periodo.Tipo_Referencia + '\','
        + '\'' + Periodo.Tipo_Valor + '\','
        + '\'' + Periodo.Aplica_Calculos + '\','
        + '\'' + Periodo.Estado + '\','
        + '\'' + Periodo.Secuencia + '\','
        + '\'' + Periodo.Valor + '\','
        + '\'' + Periodo.Formula + '\','
        + '\'' + Periodo.Etiqueta 
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Pl_Concepto_Salarial',
        fields: 'Nombre=\'' + Periodo.Nombre + '\','
        + 'Tipo_Concepto=\'' + Periodo.Tipo_Concepto + '\','
        + 'Aplica_Como=\'' + Periodo.Aplica_Como + '\','
        + 'Tipo_Referencia=\'' + Periodo.Tipo_Referencia + '\','
        + 'Tipo_Valor=\'' + Periodo.Tipo_Valor + '\','
        + 'Aplica_Calculos=\'' + Periodo.Aplica_Calculos + '\','
        + 'Estado=\'' + Periodo.Estado + '\','
        + 'Secuencia=\'' + Periodo.Secuencia + '\','
        + 'Valor=\'' + Periodo.Valor+ '\',' 
        + 'Formula=\'' + Periodo.Formula + '\','
        + 'Etiqueta=\'' + Periodo.Etiqueta 
         + '\'',
        where: 'Id_Concepto_Salarial=' + Periodo.Id_Concepto_Salarial
      };
      return await this.apiService.updateRecord(sql);
    }
  }
 

}
