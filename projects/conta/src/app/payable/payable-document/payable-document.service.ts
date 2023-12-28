import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class PayableDocumentService {

  constructor(private apiService: ApiService) {}
  async loadDocuments(paginacion,search?){
    let sqlConfig = {
      table: 'Cxp_Documento Inner Join Cxp_Cuenta on Cxp_Documento.Id_Cuenta = Cxp_Cuenta.Id_Cuenta',
      fields: 'Id_Documento,Documento,Fecha,Monto,Cxp_Documento.Moneda,Cxp_Documento.Nombre,Cxp_Documento.Estado,Cxp_Documento.Saldo,Cxp_Cuenta.Nombre as Cuenta',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadDocument(Id_Documento){
    let sqlConfig = {
      table: 'Cxp_Documento inner Join Cxp_Cuenta on Cxp_Documento.Id_Cuenta = Cxp_Cuenta.Id_Cuenta',
      fields: 'Cxp_Documento.Id_Documento,Id_Tipo_Documento,Cxp_Documento.Id_Cuenta,Fecha,Documento,Cxp_Documento.Moneda,Monto,Cxp_Documento.Nombre,Cxp_Documento.Estado,Cxp_Cuenta.Nombre as Nombre_Cuenta,Cxp_Documento.Saldo,Cxp_Documento.Tipo_Cambio, 0 as Total_Detalles, Cxp_Documento.Plazo, Cxp_Documento.Fecha_Vencimiento,Monto_Otra_Moneda',
      where: 'Cxp_Documento.Id_Documento =' + Id_Documento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async newDocument(Document){
    let sql = {
      table: 'Cxp_Documento',
      fields: 'Id_Tipo_Documento,Id_Cuenta,Fecha,Documento,Moneda,Monto,Monto_Otra_Moneda,Nombre,Tipo_Cambio,Estado,Saldo,Plazo,Fecha_Vencimiento',
      values: '\'' + Document.Id_Tipo_Documento
      + '\',\'' + Document.Id_Cuenta
      + '\',\'' + Document.Fecha_Doc
      + '\',\'' + Document.Documento
      + '\',\'' + Document.Moneda
      + '\',\'' + Document.Monto
      + '\',\'' + Document.Monto_Otra_Moneda
      + '\',\'' + Document.Nombre
      + '\',\'' + Document.Tipo_Cambio
      + '\',\'' + Document.Estado
      + '\',\'' + Document.Monto
      + '\',\'' + Document.Plazo
      + '\',\'' + Document.Fecha_Vencimiento
       + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateDocument(Document){
    let sql = {
      table: 'Cxp_Documento',
      fields: 'Id_Tipo_Documento=\'' + Document.Id_Tipo_Documento
      + '\',Id_Cuenta=\'' + Document.Id_Cuenta
      + '\',Fecha=\'' + Document.Fecha_Doc
      + '\',Documento=\'' + Document.Documento
      + '\',Moneda=\'' + Document.Moneda
      + '\',Monto=\'' + Document.Monto
      + '\',Monto_Otra_Moneda=\'' + Document.Monto_Otra_Moneda
      + '\',Nombre=\'' + Document.Nombre
      + '\',Tipo_Cambio=\'' + Document.Tipo_Cambio
      + '\',Plazo=\'' + Document.Plazo
      + '\',Fecha_Vencimiento=\'' + Document.Fecha_Vencimiento
      + '\',Estado=\''+ Document.Estado  + '\'',
      where: 'Id_Documento=' + Document.Id_Documento
    };
    return await this.apiService.updateRecord(sql);
  }
  async aplicarDocumento(Id_Documento){
    let sql = "call sp_Cxp_Aplicar_Documento("+Id_Documento+')';
    return await this.apiService.postRecord(sql);
  }

  async loadDetails(Id_Documento){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let sqlConfig = {
      table: 'Cxp_Documento_Detalle',
      fields: 'Id_Documento_Detalle,Id_Documento,Cuenta,Detalle,Monto',
      orderField: '',
      searchField: '',
      paginacion: paginacion,
      where : 'Id_Documento='+Id_Documento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async newDetail(Detalle,Id_Documento){
    let sql = {
      table: 'Cxp_Documento_Detalle',
      fields: 'Id_Documento,Cuenta,Detalle,Monto',
      values: '\'' + Id_Documento
      + '\',\'' + Detalle.Cuenta
      + '\',\'' + Detalle.Detalle
      + '\',\'' + Detalle.Monto
       + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async UpdateDetail(Detalle){
    let sql = {
      table: 'Cxp_Documento_Detalle',
      fields: 'Cuenta=\'' + Detalle.Cuenta
      + '\',Detalle=\'' + Detalle.Detalle
      + '\',Monto=\'' + Detalle.Monto
      + '\'',
      where: 'Id_Documento_Detalle=' + Detalle.Id_Documento_Detalle
    };
    return await this.apiService.updateRecord(sql);
  }
  async deleteDetails(Id_Documento,Lista){
    let sql = "DELETE FROM Cxp_Documento_Detalle WHERE Id_Documento = " + Id_Documento + " and Id_Documento_Detalle Not In (" + Lista + ")";
    return await this.apiService.postRecord(sql);
  }
}
