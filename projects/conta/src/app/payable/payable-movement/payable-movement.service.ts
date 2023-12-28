import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class PayableMovementService {

  constructor(private apiService: ApiService) {}
  async loadMovements(paginacion,search?){
    let sqlConfig = {
      table: 'Cxp_Movimiento Inner Join Cxp_Documento on Cxp_Movimiento.Id_Documento = Cxp_Documento.Id_Documento inner join Cxp_Cuenta on Cxp_Documento.Id_Cuenta = Cxp_Cuenta.Id_Cuenta',
      fields: 'Id_Movimiento,Cxp_Movimiento.Id_Documento,Id_Transaccion,Cxp_Movimiento.Documento,Cxp_Movimiento.Fecha,Cxp_Movimiento.Monto,Cxp_Movimiento.Moneda,Cxp_Movimiento.Saldo,Cxp_Movimiento.Estado,Cxp_Cuenta.Nombre as Cuenta,Cxp_Documento.Documento as Docu',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadMovement(Id_Movimiento){
    let sqlConfig = {
      table: 'Cxp_Movimiento inner Join Cxp_Documento On Cxp_Movimiento.Id_Documento = Cxp_Documento.Id_Documento left Join Cxp_Cuenta on Cxp_Documento.Id_Cuenta = Cxp_Cuenta.Id_Cuenta left Join Cge_Cuenta_Contable On Cxp_Movimiento.Cuenta_Contable = Cge_Cuenta_Contable.Cuenta',
      fields: 'Id_Movimiento,Id_Transaccion,Cxp_Movimiento.Id_Documento,Cxp_Movimiento.Fecha,Cxp_Movimiento.Documento,Cxp_Movimiento.Moneda,Cxp_Movimiento.Monto,Cxp_Movimiento.Nombre,Cxp_Movimiento.Estado,Cxp_Cuenta.Nombre as Cuenta, Cxp_Documento.Documento as Docu,Cxp_Movimiento.Tipo_Cambio,Cxp_Documento.Saldo,Cxp_Documento.Moneda as Moneda_Documento,Cuenta_Bancaria,Cuenta_Contable,Cge_Cuenta_Contable.Descripcion as Nombre_Cuenta_Contable ',
      orderField: '',
      searchField: '',
      where: "Id_Movimiento = " + Id_Movimiento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async newMovement(Movement){
    let sql = {
      table: 'Cxp_Movimiento',
      fields: 'Id_Transaccion,Id_Documento,Fecha,Documento,Moneda,Monto,Monto_Otra_Moneda,Nombre,Tipo_Cambio,Cuenta_Bancaria,Cuenta_Contable,Estado',
      values: '\'' + Movement.Id_Transaccion
      + '\',\'' + Movement.Id_Documento
      + '\',\'' + Movement.Creado_El
      + '\',\'' + Movement.Documento
      + '\',\'' + Movement.Moneda
      + '\',\'' + Movement.Monto
      + '\',\'' + Movement.Monto_Otra_Moneda
      + '\',\'' + Movement.Nombre
      + '\',\'' + Movement.Tipo_Cambio
      + '\',\'' + Movement.Cuenta_Bancaria
      + '\',\'' + Movement.Cuenta_Contable
      + '\',\'' + Movement.Estado + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateMovement(Document){
    let sql = {
      table: 'Cxp_Movimiento',
      fields: 'Id_Transaccion=\'' + Document.Id_Transaccion
      + '\',Id_Documento=\'' + Document.Id_Documento
      + '\',Fecha=\'' + Document.Creado_El
      + '\',Documento=\'' + Document.Documento
      + '\',Moneda=\'' + Document.Moneda
      + '\',Monto=\'' + Document.Monto
      + '\',Monto_Otra_Moneda =\'' + Document.Monto_Otra_Moneda
      + '\',Nombre=\'' + Document.Nombre
      + '\',Tipo_Cambio=\'' + Document.Tipo_Cambio
      + '\',Cuenta_Bancaria=\'' + Document.Cuenta_Bancaria
      + '\',Cuenta_Contable=\'' + Document.Cuenta_Contable
      + '\',Estado=\''+ Document.Estado  + '\'',
      where: 'Id_Movimiento=' + Document.Id_Movimiento
    };
    return await this.apiService.updateRecord(sql);
  }
  async aplicarMovimiento(Id_Movimiento){
    let sql = "CALL sp_Cxp_Aplicar_Movimiento(" + Id_Movimiento + ");";
    return await this.apiService.postRecord(sql);
  }

}
