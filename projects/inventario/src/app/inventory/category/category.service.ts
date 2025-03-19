import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiService: ApiService) {}

  async loadCategories(paginacion,search?,Estado?) {
    let where = '';
    if(Estado){
      where = ' Estado = 1'
    }
    let sqlConfig = {
      table: 'Inv_Categoria',
      fields: 'Id_Categoria,Nombre,Estado,Id_Tipo',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      where:where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveCategory(category){
    if(category.Id_Categoria ==""){
      let sql = {
        table: 'Inv_Categoria',
        fields: 'Nombre,Id_Tipo,Id_Cuenta_Contable_Compras,Id_Cuenta_Contable_Ventas,Codigo_Actividad,Utilidad,Cocina,Servicio,Estado,Toma_Fisica,Factura,POV,Bar,Conta',
        values: '\'' + category.Nombre
        + '\',\'' + category.Id_Tipo
        + '\',\'' + category.Id_Cuenta_Contable_Compras
        + '\',\'' + category.Id_Cuenta_Contable_Ventas
        + '\',\'' + category.Codigo_Actividad
        + '\',\'' + category.Utilidad
        + '\',\'' + category.Cocina
        + '\',\'' + category.Servicio
        + '\',\'' + category.Estado 
        + '\',\'' + category.Toma_Fisica 
        + '\',\'' + category.Factura 
        + '\',\'' + category.POV
        + '\',\'' + category.Bar
        + '\',\'' + category.Conta
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Inv_Categoria',
        fields: 'Nombre=\'' + category.Nombre
        + '\',Id_Cuenta_Contable_Compras=\'' + category.Id_Cuenta_Contable_Compras
        + '\',Id_Cuenta_Contable_Ventas=\'' + category.Id_Cuenta_Contable_Ventas
        + '\',Id_Tipo=\'' + category.Id_Tipo
        + '\',Codigo_Actividad=\'' + category.Codigo_Actividad
        + '\',Utilidad=\'' + category.Utilidad
        + '\',Cocina=\'' + category.Cocina
        + '\',Servicio=\'' + category.Servicio
        + '\',Estado=\''+ category.Estado
        + '\',Toma_Fisica=\''+ category.Toma_Fisica 
        + '\',Factura=\''+ category.Factura 
        + '\',POV=\''+ category.POV 
        + '\',Bar=\''+ category.Bar 
        + '\',Conta=\''+ category.Conta  
        + '\'',
        where: 'Id_Categoria=' + category.Id_Categoria
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadCategory(Id_Category){
    let Id_Empresa = localStorage.getItem('Id_Empresa');
    let sqlConfig = {
      table: 'Inv_Categoria left Join Cge_Cuenta_Contable as Cuenta_Compras on Inv_Categoria.Id_Cuenta_Contable_Compras = Cuenta_Compras.Cuenta and Cuenta_Compras.Id_Empresa = '+Id_Empresa+' left Join Cge_Cuenta_Contable as Cuenta_Ventas on Inv_Categoria.Id_Cuenta_Contable_Ventas = Cuenta_Ventas.Cuenta and Cuenta_Ventas.Id_Empresa = '+Id_Empresa,
      fields: "Id_Categoria,Nombre,Inv_Categoria.Estado,Codigo_Actividad,Utilidad,Cocina,Id_Tipo,Cuenta_Compras.Id_Cuenta_Contable as Id_Cuenta_Contable_Compras, concat(Cuenta_Compras.Cuenta,' - ',Cuenta_Compras.Descripcion) as Cuenta_Contable_Compras,Cuenta_Ventas.Id_Cuenta_Contable as Id_Cuenta_Contable_Ventas, concat(Cuenta_Ventas.Cuenta,' - ',Cuenta_Ventas.Descripcion)  as Cuenta_Contable_Ventas,Toma_Fisica,Factura,POV,Bar,Conta",
      orderField: '',
      searchField: '',
      where: "Id_Categoria = " + Id_Category
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCategoryWithoutAccount(){
    let sqlConfig = {
      table: 'Inv_Categoria',
      fields: "count(Id_Categoria)",
      orderField: '',
      searchField: '',
      where: "(Id_Cuenta_Contable_Compras is null or Id_Cuenta_Contable_Ventas is null)"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

}
