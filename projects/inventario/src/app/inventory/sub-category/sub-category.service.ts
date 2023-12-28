import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(private apiService: ApiService) {}

  async loadSubCategories(paginacion,search?,Estado?) {
    let where = '';
    if(Estado){
      where = ' Estado = 1'
    }
    let sqlConfig = {
      table: 'Inv_Sub_Categoria inner join Inv_Categoria on Inv_Sub_Categoria.Id_Categoria = Inv_Categoria.Id_Categoria',
      fields: 'Id_Sub_Categoria,Inv_Sub_Categoria.Nombre as Nombre, Inv_Categoria.Nombre as Categoria,Inv_Sub_Categoria.Estado',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      where: where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadSubCategoriesByCategoria(Id_Categoria,Estado?) {
    let where = "Inv_Sub_Categoria.Id_Categoria="+Id_Categoria ;
    if(Estado){
      where = 'Inv_Sub_Categoria.Estado = 1 and ' + where
    }
    let sqlConfig = {
      table: 'Inv_Sub_Categoria inner join Inv_Categoria on Inv_Sub_Categoria.Id_Categoria = Inv_Categoria.Id_Categoria',
      fields: 'Id_Sub_Categoria,Inv_Sub_Categoria.Nombre as Nombre, Inv_Categoria.Nombre as Categoria,Inv_Sub_Categoria.Estado',
      orderField: '',
      where:where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveSubCategory(category){
    if(category.Id_Sub_Categoria ==""){
      let sql = {
        table: 'Inv_Sub_Categoria',
        fields: 'Nombre,Id_Cuenta_Contable_Compras,Id_Cuenta_Contable_Ventas,Codigo_Actividad,Utilidad,Id_Categoria,Estado',
        values: '\'' + category.Nombre
        + '\',\'' + category.Id_Cuenta_Contable_Compras
        + '\',\'' + category.Id_Cuenta_Contable_Ventas
        + '\',\'' + category.Codigo_Actividad
        + '\',\'' + category.Utilidad
        + '\',\'' + category.Id_Categoria
        + '\',\'' + category.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Inv_Sub_Categoria',
        fields: 'Nombre=\'' + category.Nombre
        + '\',Id_Cuenta_Contable_Compras=\'' + category.Id_Cuenta_Contable_Compras
        + '\',Id_Cuenta_Contable_Ventas=\'' + category.Id_Cuenta_Contable_Ventas
        + '\',Codigo_Actividad=\'' + category.Codigo_Actividad
        + '\',Utilidad=\'' + category.Utilidad
        + '\',Id_Categoria=\'' + category.Id_Categoria
        + '\',Estado=\''+ category.Estado  + '\'',
        where: 'Id_Sub_Categoria=' + category.Id_Sub_Categoria
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadSubCategory(Id_Sub_Categoria){
    let Id_Empresa = localStorage.getItem('Id_Empresa');
    let sqlConfig = {
      table: 'Inv_Sub_Categoria left Join Cge_Cuenta_Contable as Cuenta_Compras on Inv_Sub_Categoria.Id_Cuenta_Contable_Compras = Cuenta_Compras.Cuenta and Cuenta_Compras.Id_Empresa = '+Id_Empresa+' left Join Cge_Cuenta_Contable as Cuenta_Ventas on Inv_Sub_Categoria.Id_Cuenta_Contable_Ventas = Cuenta_Ventas.Cuenta and Cuenta_Ventas.Id_Empresa = '+Id_Empresa,
      fields: "Id_Sub_Categoria,Id_Categoria,Nombre,Inv_Sub_Categoria.Estado,Codigo_Actividad,Utilidad,Cuenta_Compras.Id_Cuenta_Contable as Id_Cuenta_Contable_Compras, concat(Cuenta_Compras.Cuenta,' - ',Cuenta_Compras.Descripcion) as Cuenta_Contable_Compras,Cuenta_Ventas.Id_Cuenta_Contable as Id_Cuenta_Contable_Ventas, concat(Cuenta_Ventas.Cuenta,' - ',Cuenta_Ventas.Descripcion) as Cuenta_Contable_Ventas",
      orderField: '',
      searchField: '',
      where: "Id_Sub_Categoria = " + Id_Sub_Categoria
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadSubCategoryWithoutAccount(){
    let sqlConfig = {
      table: 'Inv_Sub_Categoria',
      fields: "count(Id_Sub_Categoria)",
      orderField: '',
      searchField: '',
      where: "(Id_Cuenta_Contable_Compras is null or Id_Cuenta_Contable_Ventas is null)"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
