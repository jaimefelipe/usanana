import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class MovementInventoryService {

  constructor(private apiService: ApiService) {}
  async loadMovements(paginacion,search?){
    let sqlConfig = {
      table: `(SELECT Id_Empresa, Id_Movimiento, Tipo_Movimiento, Id_Factura, Nombre, Moneda, Tipo_Cambio, Total, Sistema_Origen, Estado,  Creado_El, Creado_Por,  Registro_Origen, CASE Tipo_Movimiento WHEN '01' THEN 'Venta'  WHEN '02' THEN 'Compra' WHEN '03' THEN 'Nota de débito (-)' WHEN '04' THEN 'Nota de crédito (+)' ELSE 'Otro' END AS Tipo_Movimiento_Descripcion FROM Inv_Movimiento) AS movimientos`,
      fields: `Id_Movimiento,Tipo_Movimiento,Id_Factura,Nombre,Moneda,Tipo_Cambio,Total,Sistema_Origen,Estado,Creado_El,Creado_Por,Registro_Origen,Tipo_Movimiento_Descripcion`,
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadMovement(Id_Movimiento){
    let sqlConfig = {
      table: 'Inv_Movimiento',
      fields: 'Id_Movimiento,Tipo_Movimiento,Id_Factura,Nombre,Moneda,Tipo_Cambio,Descuento,IVA,Sub_Total,Total,Otros_Servicios,Sistema_Origen,Registro_Origen,Estado,Creado_El',
      orderField: '',
      searchField: '',
      where: 'Id_Movimiento = ' + Id_Movimiento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadMovementDetails(Id_Movimiento){
    let sqlConfig = {
      table: 'Inv_Movimiento_Detalle',
      fields: 'Id_Movimiento_Detalle,Id_Producto,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,Descuento,Detalle_Descuento,Tasa as IVAPorcentaje,IVA,Sub_Total,Total',
      orderField: '',
      searchField: '',
      where: 'Id_Movimiento = ' + Id_Movimiento
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async leerDetallesPorProducto(Id_Producto){
    let sqlConfig = {
      table: 'Inv_Movimiento_Detalle inner Join Inv_Movimiento on Inv_Movimiento_Detalle.Id_Movimiento = Inv_Movimiento.Id_Movimiento',
      fields: 'Id_Producto,Inv_Movimiento.Creado_El,Inv_Movimiento_Detalle.Id_Movimiento,Tipo_Movimiento,Nombre,Cantidad,Unidad_Medida,Precio,Inv_Movimiento_Detalle.Total ',
      orderField: '',
      searchField: '',
      where: 'Id_Producto = ' + Id_Producto
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
    if(!Movement.Id_Factura){
      Movement.Id_Factura = 'NULL';
    }
    if(!Movement.Descuento){
      Movement.Descuento = 0;
    }
    if(!Movement.Otros_Servicios){
      Movement.Otros_Servicios = 0;
    }
    if(!Movement.Sistema_Origen){
      Movement.Sistema_Origen = 'Inv';
    }
    let sqlMovement = {
      table: 'Inv_Movimiento',
      fields: 'Tipo_Movimiento,Id_Factura,Nombre,Moneda,Tipo_Cambio,Descuento,IVA,Sub_Total,Total,Otros_Servicios,Sistema_Origen,Registro_Origen,Estado',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Movement.Tipo_Movimiento
      + '\',\'' + Movement.Id_Factura
      + '\',\'' + Movement.Nombre
      + '\',\'' + Movement.Moneda
      + '\',\'' + Movement.Tipo_Cambio
      + '\',\'' + Movement.Descuento
      + '\',\'' + Movement.IVA
      + '\',\'' + Movement.Sub_Total
      + '\',\'' + Movement.Total
      + '\',\'' + Movement.Otros_Servicios
      + '\',\'' + Movement.Sistema_Origen
      + '\',\'' + Movement.Registro_Origen
      + '\',\'' + Movement.Estado + '\''
    };
    return await this.apiService.insertRecord(sqlMovement);
  }
  async updateHeader(Movement){
    if(Movement.Descuento =""){
      Movement.Descuento = 0;
    }
    let sqlActualizarFactura = {
      table: 'Inv_Movimiento',
      // tslint:disable-next-line: max-line-length
      fields: 'Tipo_Movimiento = \'' + Movement.Tipo_Movimiento
      + '\',Id_Factura = \'' + Movement.Id_Factura
      + '\',Nombre = \'' + Movement.Nombre
      + '\',Moneda = \'' + Movement.Moneda
      + '\',Tipo_Cambio = \'' + Movement.Tipo_Cambio
      //+ '\',Descuento = \'' + Movement.Descuento
      + '\',IVA = \'' + Movement.IVA
      + '\',Sub_Total = \'' + Movement.Sub_Total
      + '\',Total = \'' + Movement.Total
      + '\',Sistema_Origen = \'' + Movement.Sistema_Origen
      + '\',Registro_Origen = \'' + Movement.Registro_Origen
      + '\',Estado = \'' + Movement.Estado + '\'',
      where: 'Id_Movimiento =' + Movement.Id_Movimiento
    };
    return await this.apiService.updateRecord(sqlActualizarFactura);
  }
  async deleteDetails(Id_Movimiento,Lista){
    let sql = "DELETE FROM Inv_Movimiento_Detalle WHERE Id_Movimiento=" + Id_Movimiento + " and Id_Movimiento_Detalle Not In (" + Lista + ")";
    return await this.apiService.postRecord(sql);
   // return await this.apiService.executeSqlSyn(sql);
  }
  async insertDetail(Detail,Id_Movimiento){
    let sqlFacturaDetalle = {
      table: 'Inv_Movimiento_Detalle',
      fields: 'Id_Producto,Id_Movimiento,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,IVA,Sub_Total,Total,Tasa',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Detail.Id_Producto
      + '\',\'' + Id_Movimiento
      + '\',\'' + Detail.Tipo_Codigo
      + '\',\'' + Detail.Codigo_Referencia
      + '\',\'' + Detail.Descripcion
      + '\',\'' + Detail.Unidad_Medida
      + '\',\'' + Detail.Cantidad
      + '\',\'' + Detail.Precio
      + '\',\'' + Detail.IVA
      + '\',\'' + Detail.Sub_Total
      + '\',\'' + Detail.Total
      + '\',\'' +  Detail.IVAPorcentaje
      + '\''
    };
    return await this.apiService.insertRecord(sqlFacturaDetalle);
  }
  async updateDetail(Detail){
    let sqlActualizarFactura = {
      table: 'Inv_Movimiento_Detalle',
      // tslint:disable-next-line: max-line-length
      fields: 'Id_Producto = ' + Detail.Id_Producto
      + ',Tipo_Codigo = \'' + Detail.Tipo_Codigo
      + '\',Codigo_Referencia = \'' + Detail.Codigo_Referencia
      + '\',Descripcion = \'' + Detail.Descripcion
      + '\',Unidad_Medida = \'' + Detail.Unidad_Medida
      + '\',Cantidad = \'' + Detail.Cantidad
      + '\',Precio = \'' + Detail.Precio
      + '\',IVA = \'' + Detail.IVA
      + '\',Sub_Total = \'' + Detail.Sub_Total
      + '\',Total = \'' + Detail.Total
      + '\',Tasa = \'' + Detail.IVAPorcentaje + '\'',
      where: 'Id_Movimiento_Detalle =' + Detail.Id_Movimiento_Detalle
    };
    return await this.apiService.updateRecord(sqlActualizarFactura);
  }
  async aplicarMovimiento(Id_Movimiento){
    let sql = "call sp_Inv_Aplicar_Movimiento(" + Id_Movimiento+")";
    return await this.apiService.postRecord(sql);
  }
}
