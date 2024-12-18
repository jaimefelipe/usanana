import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConceptoTipoPlanillaService {

constructor( 
  private apiService:ApiService
) { }
  async loadConceptosTipoPlanilla(paginacion?,search?,Estado?){
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Pl_Concepto_Tipo_Planilla inner join Pl_Concepto_Salarial on Pl_Concepto_Tipo_Planilla.Id_Concepto_Salarial = Pl_Concepto_Salarial.Id_Concepto_Salarial Inner Join Pl_Tipo_Planilla on Pl_Concepto_Tipo_Planilla.Id_Tipo_Planilla = Pl_Tipo_Planilla.Id_Tipo_Planilla',
      fields: 'Id_Concepto_Tipo_Planilla,Pl_Concepto_Tipo_Planilla.Id_Tipo_Planilla,Pl_Concepto_Tipo_Planilla.Id_Concepto_Salarial,Pl_Concepto_Tipo_Planilla.Estado, Pl_Concepto_Salarial.Nombre as Concepto_Salarial, Pl_Tipo_Planilla.Nombre as Tipo_Planilla',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadConceptoTIpoPlanilla(Id_Concepto_Tipo_Planilla){
    let sqlConfig = {
      table: 'Pl_Concepto_Tipo_Planilla',
      fields: 'Id_Concepto_Tipo_Planilla,Id_Tipo_Planilla,Id_Concepto_Salarial,Estado',
      where: 'Id_Concepto_Tipo_Planilla='+Id_Concepto_Tipo_Planilla
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveConceptoTipoPlanilla(ConceptoTipoPlanilla){
  if(ConceptoTipoPlanilla.Id_Concepto_Tipo_Planilla == ""){
    let sql = {
      table: 'Pl_Concepto_Tipo_Planilla',
      fields: 'Id_Tipo_Planilla,Id_Concepto_Salarial,Estado',
      values: '\'' + ConceptoTipoPlanilla.Id_Tipo_Planilla  + '\','
      + '\'' + ConceptoTipoPlanilla.Id_Concepto_Salarial + '\','
      + '\'' + ConceptoTipoPlanilla.Estado 
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }else{
    let sql = {
      table: 'Pl_Concepto_Tipo_Planilla',
      fields: 'Id_Tipo_Planilla=\'' + ConceptoTipoPlanilla.Id_Tipo_Planilla + '\','
      + 'Id_Concepto_Salarial=\'' + ConceptoTipoPlanilla.Id_Concepto_Salarial
      + 'Estado=\'' + ConceptoTipoPlanilla.Estado
       + '\'',
      where: 'Id_Concepto_Tipo_Planilla=' + ConceptoTipoPlanilla.Id_Concepto_Tipo_Planilla
    };
    return await this.apiService.updateRecord(sql);
  }
}

}
