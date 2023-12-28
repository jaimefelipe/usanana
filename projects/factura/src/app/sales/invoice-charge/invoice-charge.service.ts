import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class InvoiceChargeService {

constructor(private apiService:ApiService) { }

  async loadChargees(paginacion,search?) {
    let sqlConfig = {
      table: 'Ven_Factura_Cargos',
      fields: 'Id_Factura_Cargos,Nombre,Iva,Porcentaje,Estado',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCharge(Id_Factura_Cargos){
    let sqlConfig = {
      table: 'Ven_Factura_Cargos',
      fields: 'Id_Factura_Cargos,Nombre,Id_Categoria,Iva,Porcentaje,Estado,Cavys as Codigo',
      orderField: '',
      searchField: '',
      where: "Id_Factura_Cargos = " + Id_Factura_Cargos
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async insertCharge(Charge){
    let sql = {
      table: 'Ven_Factura_Cargos',
      fields: 'Nombre,Iva,Id_Categoria,Porcentaje,Estado,Cavys',
      values: '\'' + Charge.Nombre
      + '\',\'' + Charge.Iva
      + '\',\'' + Charge.Id_Categoria
      + '\',\'' + Charge.Porcentaje
      + '\',\'' + Charge.Estado
      + '\',\'' + Charge.Codigo
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateCharge(Charge){
    let sql = {
      table: 'Ven_Factura_Cargos',
      fields: 'Nombre=\'' + Charge.Nombre
      + '\',Id_Categoria=\'' + Charge.Id_Categoria
      + '\',Iva=\'' + Charge.Iva
      + '\',Porcentaje=\'' + Charge.Porcentaje
      + '\',Estado=\'' + Charge.Estado
      + '\',Cavys=\'' + Charge.Codigo
      + '\'',
      where: 'Id_Factura_Cargos=' + Charge.Id_Factura_Cargos
    };
    return await this.apiService.updateRecord(sql);
  }
}
