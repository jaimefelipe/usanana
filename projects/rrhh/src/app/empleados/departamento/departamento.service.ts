import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  constructor(private apiService: ApiService) {}
  async loadDepartamentos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Rhh_Departamento',
      fields: 'Id_Departamento,Departamento',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadDepartamento(Id_Departamento) {
    let sqlConfig = {
      table: 'Rhh_Departamento',
      fields: 'Id_Departamento,Departamento',
      where: 'Id_Departamento='+Id_Departamento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveDepartamento(Departamento){
    if(Departamento.Id_Departamento == ""){
      let sql = {
        table: 'Rhh_Departamento',
        fields: 'Departamento',
        values: '\'' + Departamento.Departamento
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Rhh_Departamento',
        fields: 'Departamento=\'' + Departamento.Departamento
         + '\'',
        where: 'Id_Departamento=' + Departamento.Id_Departamento
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
