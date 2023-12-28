import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CashierMovementService {

  constructor(private apiService: ApiService) {}
  async loadMovements(paginacion,search?){
    let sqlConfig = {
      table: 'Ven_Movimiento_Caja',
      fields: 'Id_Movimiento,Tipo_Movimiento,Id_Comprobante,Moneda,Descripcion,Tipo_Cambio,Total,Estado,Creado_El',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadMovement(Id_Movimiento){
    let sqlConfig = {
      table: 'Ven_Movimiento_Caja',
      fields: 'Id_Movimiento,Tipo_Movimiento,Id_Comprobante,Moneda,Tipo_Cambio,Total,Estado,Creado_El,Descripcion,Numero_Identificacion,Id_Persona as Id_Cliente,Codigo_Identificacion,Nombre_Cliente,Condicion_Venta',
      orderField: '',
      searchField: '',
      where: 'Id_Movimiento = ' + Id_Movimiento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadMovementDetails(Id_Movimiento){
    let sqlConfig = {
      table: 'Ven_Movimiento_Caja_Detalle',
      fields: 'Id_Movimiento_Detalle,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,Total',
      orderField: '',
      searchField: '',
      where: 'Id_Movimiento = ' + Id_Movimiento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadProduct(producto){
    let sqlProducto = {
      table: 'Inv_Producto',
      fields: 'Id_Producto,Codigo,Tipo_Codigo,Descripcion,Unidad_Medida,Categoria,Impuesto,Tipo_Impuesto,Precio,Moneda,Estado',
      where: '( Id_Producto like \'---' + producto + '---\' or Descripcion like \'---' + producto + '---\' or Codigo like \'---' + producto + '---\') and Estado = 1'
     };
     return await this.apiService.executeSqlSyn(sqlProducto);
  }
  async insertHeader(Movement){
    let sqlMovement = {
      table: 'Ven_Movimiento_Caja',
      fields: 'Tipo_Movimiento,Id_Comprobante,Id_Caja,Descripcion,Moneda,Tipo_Cambio,Total,Numero_Identificacion,Id_Persona,Nombre_Cliente,Condicion_Venta,Codigo_Identificacion,Id_Caja_Diaria,Estado',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Movement.Tipo_Movimiento
      + '\',\'' + Movement.Id_Comprobante
      + '\',\'' + Movement.Id_Caja
      + '\',\'' + Movement.Descripcion
      + '\',\'' + Movement.Moneda
      + '\',\'' + Movement.Tipo_Cambio
      + '\',\'' + Movement.Total
      + '\',\'' + Movement.Numero_Identificacion
      + '\',\'' + Movement.Id_Cliente
      + '\',\'' + Movement.Nombre_Cliente
      + '\',\'' + Movement.Condicion_Venta
      + '\',\'' + Movement.Codigo_Identificacion
      + '\',\'' + Movement.Id_Caja_Diaria
      + '\',\'' + Movement.Estado + '\''
    };
    return await this.apiService.insertRecord(sqlMovement);
  }
  async updateHeader(Movement){
    if(Movement.Descuento =""){
      Movement.Descuento = 0;
    }
    let sqlActualizarFactura = {
      table: 'Ven_Movimiento_Caja',
      // tslint:disable-next-line: max-line-length
      fields: 'Tipo_Movimiento = \'' + Movement.Tipo_Movimiento
      + '\',Id_Comprobante = \'' + Movement.Id_Comprobante
      + '\',Descripcion = \'' + Movement.Descripcion
      + '\',Moneda = \'' + Movement.Moneda
      + '\',Tipo_Cambio = \'' + Movement.Tipo_Cambio
      + '\',Total = \'' + Movement.Total
      + '\',Numero_Identificacion = \'' + Movement.Numero_Identificacion
      + '\',Id_Persona = \'' + Movement.Id_Cliente
      + '\',Nombre_Cliente = \'' + Movement.Nombre_Cliente
      + '\',Condicion_Venta = \'' + Movement.Condicion_Venta
      + '\',Codigo_Identificacion = \'' + Movement.Codigo_Identificacion
      + '\',Estado = \'' + Movement.Estado + '\'',
      where: 'Id_Movimiento =' + Movement.Id_Movimiento
    };
    return await this.apiService.updateRecord(sqlActualizarFactura);
  }
  async deleteDetails(Id_Movimiento){
    let sql = "DELETE FROM Ven_Movimiento_Caja_Detalle WHERE Id_Movimiento=" + Id_Movimiento;
    return await this.apiService.postRecord(sql);
   // return await this.apiService.executeSqlSyn(sql);
  }
  async insertDetail(Detail,Id_Movimiento){
    let sqlFacturaDetalle = {
      table: 'Ven_Movimiento_Caja_Detalle',
      fields: 'Id_Movimiento,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,Total,Estado',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Id_Movimiento
      + '\',\'' + Detail.Codigo_Referencia
      + '\',\'' + Detail.Descripcion
      + '\',\'' + Detail.Unidad_Medida
      + '\',\'' + Detail.Cantidad
      + '\',\'' + Detail.Precio
      + '\',\'' + Detail.Total
      + '\',\'1'
      + '\''
    };
    return await this.apiService.insertRecord(sqlFacturaDetalle);
  }
  async aplicarMovimiento(Id_Movimiento){
    await this.apiService.postRecord('Call sp_Caja_Crear_CxC(' + Id_Movimiento + ')' );
    let sql = "Update Ven_Movimiento_Caja set Estado = 1 where Id_Movimiento = " + Id_Movimiento;
    return await this.apiService.postRecord(sql);
  }
}
