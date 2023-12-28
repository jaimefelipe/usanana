import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class ReceivableMovementService {

  constructor(private apiService: ApiService) {}
  async loadMovements(paginacion,search?){
    let sqlConfig = {
      table: 'Cxc_Movimiento Inner Join Cxc_Documento on Cxc_Movimiento.Id_Documento = Cxc_Documento.Id_Documento inner join Cxc_Cuenta on Cxc_Documento.Id_Cuenta = Cxc_Cuenta.Id_Cuenta',
      fields: 'Id_Movimiento,Cxc_Movimiento.Id_Documento,Id_Transaccion,Cxc_Movimiento.Documento,Cxc_Movimiento.Fecha,Cxc_Movimiento.Monto,Cxc_Movimiento.Moneda,Cxc_Movimiento.Saldo,Cxc_Movimiento.Estado,Cxc_Cuenta.Nombre as Cuenta,Cxc_Documento.Documento as Docu',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadMovement(Id_Movimiento){
    let sqlConfig = {
      table: 'Cxc_Movimiento inner Join Cxc_Documento On Cxc_Movimiento.Id_Documento = Cxc_Documento.Id_Documento left Join Cxc_Cuenta on Cxc_Documento.Id_Cuenta = Cxc_Cuenta.Id_Cuenta left Join Cge_Cuenta_Contable On Cxc_Movimiento.Cuenta_Contable = Cge_Cuenta_Contable.Cuenta',
      fields: 'Id_Movimiento,Id_Transaccion,Cxc_Movimiento.Id_Documento,Cxc_Movimiento.Fecha,Cxc_Movimiento.Documento,Cxc_Movimiento.Moneda,Cxc_Movimiento.Monto,Cxc_Movimiento.Nombre,Cxc_Movimiento.Estado,Cxc_Cuenta.Nombre as Cuenta, Cxc_Documento.Documento as Docu,Cxc_Movimiento.Tipo_Cambio,Cxc_Documento.Saldo,Cxc_Documento.Moneda as Moneda_Documento,Cuenta_Bancaria,Cuenta_Contable,Cge_Cuenta_Contable.Descripcion as Nombre_Cuenta_Contable ',
      orderField: '',
      searchField: '',
      where: "Id_Movimiento = " + Id_Movimiento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async newMovement(Movement){
    let sql = {
      table: 'Cxc_Movimiento',
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
      table: 'Cxc_Movimiento',
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
    let sql = "CALL sp_Cxc_Aplicar_Movimiento(" + Id_Movimiento + ");";
    return await this.apiService.postRecord(sql);
  }

}
