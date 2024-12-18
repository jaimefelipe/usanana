import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TomaFisicaService {

  constructor(private apiService: ApiService) {}

  /** Encabezado de toma fisica */

  async loadTomasFisicas(paginacion,search?,Estado?) {
    let sqlConfig = {
      table: 'Inv_Toma_Fisica',
      fields: 'Id_Toma_Fisica,Fecha,Estado',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadTomaFisica(Id_Toma_Fisica,Estado?) {
    
    let sqlConfig = {
      table: 'Inv_Toma_Fisica',
      fields: 'Id_Toma_Fisica,Fecha,Estado',
      orderField: '',
      where:'Id_Toma_Fisica = '+ Id_Toma_Fisica
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async saveTomaFisica(Toma_Fisica){
    if(Toma_Fisica.Id_Toma_Fisica ==""){
      let sql = {
        table: 'Inv_Toma_Fisica',
        fields: 'Fecha,Estado',
        values: '\'' + Toma_Fisica.Fecha
        + '\',\'' + Toma_Fisica.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Inv_Toma_Fisica',
        fields: 'Fecha=\'' + Toma_Fisica.Fecha
        + '\',Estado=\'' + Toma_Fisica.Estado + '\'',
        where: 'Id_Toma_Fisica = '+ Toma_Fisica.Id_Toma_Fisica
      };
      return await this.apiService.updateRecord(sql);
    }
  }

  /**Detalle de toma fisica */
  async loadTomasFisicasDetalles(Id_Toma_Fisica,paginacion,search?,Estado?) {
    let where = '';
    if(Estado){
      where = ' Estado = 1'
    }
    let sqlConfig = {
      table: 'Inv_Toma_Fisica_Detalle',
      fields: 'Id_Toma_Fisica_Detalle,Id_Toma_Fisica,Id_Producto,Cantidad_Actual as Existencia ,Cantidad_Contada as Cantidad,Estado,SKU,Descripcion,Precio',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      where: 'Id_Toma_Fisica = ' + Id_Toma_Fisica
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  
  async saveTomaFisicaDetalle(Toma_Fisica_Detalle){
    if(Toma_Fisica_Detalle.Id_Toma_Fisica_Detalle ==""){
      let sql = {
        table: 'Inv_Toma_Fisica_Detalle',
        fields: 'Id_Toma_Fisica,Id_Producto,Cantidad_Actual,Cantidad_Contada,Estado,SKU,Descripcion,Precio',
        values: '\'' + Toma_Fisica_Detalle.Id_Toma_Fisica
        + '\',\'' + Toma_Fisica_Detalle.Id_Producto
        + '\',\'' + Toma_Fisica_Detalle.Existencia
        + '\',\'' + Toma_Fisica_Detalle.Cantidad
        + '\',\'' + 0 
        + '\',\'' + Toma_Fisica_Detalle.SKU 
        + '\',\'' + Toma_Fisica_Detalle.Descripcion 
        + '\',\'' + Toma_Fisica_Detalle.Precio 
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Inv_Toma_Fisica_Detalle',
        fields: 'Id_Toma_Fisica=\'' + Toma_Fisica_Detalle.Id_Toma_Fisica
        + '\',Id_Producto=\'' + Toma_Fisica_Detalle.Id_Producto
        + '\',Cantidad_Actual=\'' + Toma_Fisica_Detalle.Existencia
        + '\',Cantidad_Contada=\'' + Toma_Fisica_Detalle.Cantidad
        + '\',Estado=\'' + Toma_Fisica_Detalle.Estado 
        + '\',SKU=\'' + Toma_Fisica_Detalle.SKU 
        + '\',Descripcion=\'' + Toma_Fisica_Detalle.Descripcion
        + '\',Precio=\'' + Toma_Fisica_Detalle.Precio + '\'',
        where: 'Id_Toma_Fisica_Detalle = '+ Toma_Fisica_Detalle.Id_Toma_Fisica_Detalle
      };
      return await this.apiService.updateRecord(sql);
    }
    
  }
  async deleteDetails(Id_Toma_Fisica,Lista){
    let sql = "DELETE FROM Inv_Toma_Fisica_Detalle WHERE Id_Toma_Fisica = " + Id_Toma_Fisica + " and Id_Toma_Fisica_Detalle Not In (" + Lista + ")";
    return await this.apiService.postRecord(sql);
   // return await this.apiService.executeSqlSyn(sql);
  }
}
