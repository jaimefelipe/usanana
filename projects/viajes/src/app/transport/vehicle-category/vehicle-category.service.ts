import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleCategoryService {

  constructor(private apiService: ApiService) {}

  async loadCategories(paginacion,search?) {
    let sqlConfig = {
      table: 'Tra_Categoria_Vehiculo',
      fields: 'Id_Categoria_Vehiculo,Nombre',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveCategory(category){
    if(category.Id_Categoria_Vehiculo ==""){
      let sql = {
        table: 'Tra_Categoria_Vehiculo',
        fields: 'Nombre',
        values: '\'' + category.Nombre
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Tra_Categoria_Vehiculo',
        fields: 'Nombre=\'' + category.Nombre
        + '\'',
        where: 'Id_Categoria_Vehiculo=' + category.Id_Categoria_Vehiculo
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadCategory(Id_Categoria_Vehiculo){
    let sqlConfig = {
      table: 'Tra_Categoria_Vehiculo',
      fields: 'Id_Categoria_Vehiculo,Nombre',
      orderField: '',
      searchField: '',
      where: "Id_Categoria_Vehiculo = " + Id_Categoria_Vehiculo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
}
