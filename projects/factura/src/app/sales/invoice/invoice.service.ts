import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private apiService: ApiService) {}
  async loadInvoices(paginacion,search?){
    let sqlConfig = {
      table: 'Ven_Factura',
      fields: 'Id_Factura,Consecutivo,Creado_El,Tipo_Documento,Nombre,Numero_Identificacion,Respuesta_MH,Moneda,Metodo_Pago,Condicion_Venta',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      orderDirection:' DESC '
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadInvoice(Id_Factura){
    let sqlConfig = {
      table: 'Ven_Factura Left Join Gen_Persona on Ven_Factura.Id_Empresa = Gen_Persona.Id_Empresa and Ven_Factura.Numero_Identificacion = Gen_Persona.Identificacion',
      fields: 'Id_Factura,Tipo_Documento,Ven_Factura.Nombre,Codigo_Identificacion,Numero_Identificacion,Ven_Factura.Correo,Ven_Factura.Condicion_Venta,Ven_Factura.Plazo_Credito,Ven_Factura.Metodo_Pago,Ven_Factura.Moneda,Tipo_Cambio,IVA,Sub_Total,Total,Respuesta_MH,Consecutivo,Ven_Factura.Creado_El,Notas,Exonerada,Exo_Numero_Documento,Exo_Nombre_Institucion,Exo_Porcentaje,Exo_Monto,Exo_Fecha_Emision,Gen_Persona.Id_Persona as Id_Cliente,Clave_Numerica,Id_Caja_Diaria,Actividad_Economica_Clientes as Actividad_Economica, Actividad_Economica_Empresa,Ven_Factura.Correo2',
      orderField: '',
      searchField: '',
      where: 'Id_Factura = ' + Id_Factura
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCargos(){
    let sqlConfig = {
      table: 'Ven_Factura_Cargos',
      fields: 'Id_Factura_Cargos,Nombre,Id_Categoria,Porcentaje',
      orderField: '',
      searchField: '',
      where: 'Estado = ' + 1
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadInvoiceDetails(Id_Factura){
    let sqlConfig = {
      table: 'Ven_Factura_Detalle left Join Inv_Producto on Ven_Factura_Detalle.Id_Producto = Inv_Producto.Id_Producto',
      fields: 'Id_Factura_detalle,Id_Factura,Ven_Factura_Detalle.Id_Producto,Codigo_Referencia,Ven_Factura_Detalle.Descripcion,Ven_Factura_Detalle.Unidad_Medida,Cantidad,Ven_Factura_Detalle.Precio,Descuento,IVA,Sub_Total,Total,Ven_Factura_Detalle.Estado,Ven_Factura_Detalle.Id_Empresa,Tasa as IVAPorcentaje,Ven_Factura_Detalle.Tipo_Impuesto,Ven_Factura_Detalle.SKU,Ven_Factura_Detalle.Tipo_Codigo,Adicional,Categoria as Id_Categoria',
      orderField: '',
      searchField: '',
      where: 'Id_Factura = ' + Id_Factura
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async validClient(Numero_Identificacion){
    let sqlCedula = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre,Correo,Correo2,Telefono,Identificacion,Tipo_Identificacion,Condicion_Venta,Plazo_Credito,Metodo_Pago,Estado,Moneda,Codigo_Actividad_Economica',
      orderField: '',
      searchField: '',
      where: 'Identificacion like \'---' + Numero_Identificacion + '---\' or Nombre like \'---' + Numero_Identificacion + '---\''
     };
     let data =  await this.apiService.executeSqlSyn(sqlCedula);
     return data;
  }
  async getApiHacienda(Numero_Identificacion){
   return await this.apiService.getApiHacienda(Numero_Identificacion);
  }
  async loadProduct(producto){
    let sqlProducto = {
      table: 'Inv_Producto',
      fields: 'Id_Producto,Codigo,Tipo_Codigo,Descripcion,Unidad_Medida,Categoria,Impuesto,Tipo_Impuesto,Precio,Moneda,Estado',
      where: '( Id_Producto like \'---' + producto + '---\' or Descripcion like \'---' + producto + '---\' or Codigo like \'----' + producto + '---\' or SKU like \'---' + producto + '---\') and Estado = 1'
     };
     return await this.apiService.executeSqlSyn(sqlProducto);
  }
  async insertClient(Invoice){
    let sqlCliente = {
      table: 'Gen_Persona',
      fields: 'Nombre,Correo,Correo2,Codigo_Actividad_Economica,Identificacion,Tipo_Identificacion,Condicion_Venta,Plazo_Credito,Metodo_Pago,Estado',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Invoice.Nombre + '\',\'' + Invoice.Correo + '\',\'' + Invoice.Correo2 + '\',\'' + Invoice.Actividad_Economica + '\',\'' + Invoice.Numero_Identificacion + '\',\'' + Invoice.Codigo_Identificacion + '\',\'01\',0,\'01\',1'
    };
    return await this.apiService.insertRecord(sqlCliente);
  }
  async validateHeader(Invoice){
    if(Invoice.Tipo_Documento == ''){
      Invoice.Tipo_Documento = '01';
    }
    if(Invoice.Metodo_Pago == ''){
      Invoice.Metodo_Pago = '01';
    }
    if(Invoice.Moneda == ''){
      Invoice.Moneda = 'CRC';
    }
    if(Invoice.Metodo_Pago == ''){
      Invoice.Metodo_Pago = '01';
    }
    if(Invoice.Tipo_Cambio == ''){
      Invoice.Tipo_Cambio = '1';
    }
    if(Invoice.Condicion_Venta == ''){
      Invoice.Condicion_Venta = '01';
    }
    if(Invoice.Plazo_Credito == ''){
      Invoice.Plazo_Credito = '0';
    } 
    if(Invoice.Id_Cliente  == ''){
      Invoice.Id_Cliente  = 'null';
    }
    if(!Invoice.Id_Cliente){
      Invoice.Id_Cliente  = 'null';
    }  
    return Invoice;
  }
  async insertHeader(Invoice,Caja,Exoneracion){
    Invoice = await this.validateHeader(Invoice);
    if(Invoice.Id_Caja_Diaria == '0'){
      Invoice.Id_Caja_Diaria == localStorage.getItem('Id_Caja_Diaria');
    }
    if(Invoice.Id_Caja_Diaria == ''){
      Invoice.Id_Caja_Diaria == localStorage.getItem('Id_Caja_Diaria');
    }
    if(Invoice.Id_Caja_Diaria == '' || !Invoice.Id_Caja_Diaria ){
      Invoice.Id_Caja_Diaria = 'null';
    }
    let sqlInvoice = {
      table: 'Ven_Factura',
      fields: 'Id_Cliente,Id_Caja,Nombre,Correo,Correo2,Numero_Identificacion,Codigo_Identificacion,Metodo_Pago,Plazo_Credito,Condicion_Venta,IVA,Sub_Total,Total,Tipo_Documento,Moneda,Tipo_Cambio,Respuesta_MH,Notas,Exonerada,Exo_Numero_Documento,Exo_Nombre_Institucion,Exo_Fecha_Emision,Exo_Porcentaje,Exo_Monto,Id_Caja_Diaria,Sistema_Origen,Registro_Origen,Actividad_Economica_Clientes,Actividad_Economica_Empresa',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Invoice.Id_Cliente
      + '\',\'' + Caja
      + '\',\'' + Invoice.Nombre
      + '\',\'' + Invoice.Correo
      + '\',\'' + Invoice.Correo2
      + '\',\'' + Invoice.Numero_Identificacion
      + '\',\'' + Invoice.Codigo_Identificacion
      + '\',\'' + Invoice.Metodo_Pago
      + '\',\'' + Invoice.Plazo_Credito
      + '\',\'' + Invoice.Condicion_Venta
      + '\',\'' + Invoice.IVA
      + '\',\'' + Invoice.Sub_Total
      + '\',\'' + Invoice.Total
      + '\',\'' + Invoice.Tipo_Documento
      + '\',\'' + Invoice.Moneda
      + '\',\'' + Invoice.Tipo_Cambio + '\',\'Registrado\',\''
      + Invoice.Notas
      + '\',\'' + Exoneracion.Exonerada
      + '\',\'' + Exoneracion.Exo_Numero_Documento
      + '\',\'' + Exoneracion.Exo_Nombre_Institucion
      + '\',\'' + Exoneracion.Exo_Fecha_Emision
      + '\',\'' + Exoneracion.Exo_Porcentaje
      + '\',\'' + Exoneracion.Exo_Monto
      + '\',\'' + Invoice.Id_Caja_Diaria
      + '\',\'' + Invoice.Sistema_Origen
      + '\',\'' + Invoice.Registro_Origen
      + '\',\'' + Invoice.Actividad_Economica
      + '\',\'' + Invoice.Actividad_Economica_Empresa
      + '\''
    };
    return await this.apiService.insertRecord(sqlInvoice);
  }
  async updateHeader(Invoice,Caja,Exoneracion){
    Invoice = await this.validateHeader(Invoice);
    Exoneracion.Exo_Monto = 0;
    if (Exoneracion.Exo_Porcentaje == ''){
      Exoneracion.Exo_Porcentaje = 0;
    }
    if (Exoneracion.Exonerada == ''){
      Exoneracion.Exonerada = 0;
    }
    if(Invoice.Id_Caja_Diaria === ''){
      Invoice.Id_Caja_Diaria = 0;
    }
    if(Invoice.Id_Caja_Diaria == 0){
      Invoice.Id_Caja_Diaria = 'null';
    }
    let sqlActualizarFactura = {
      table: 'Ven_Factura',
      // tslint:disable-next-line: max-line-length
      fields: 'Id_Cliente = ' + Invoice.Id_Cliente
      + ',Tipo_Documento = \'' + Invoice.Tipo_Documento
      + '\',Nombre = \'' + Invoice.Nombre
      + '\',Codigo_Identificacion = \'' + Invoice.Codigo_Identificacion
      + '\',Numero_Identificacion = \'' + Invoice.Numero_Identificacion
      + '\',Correo = \'' + Invoice.Correo
      + '\',Correo2 = \'' + Invoice.Correo2
      + '\',Metodo_Pago = \'' + Invoice.Metodo_Pago
      + '\',Moneda = \'' + Invoice.Moneda
      + '\',IVA = \'' + Invoice.IVA
      + '\',Condicion_Venta = \'' + Invoice.Condicion_Venta
      + '\',Plazo_Credito = ' + Invoice.Plazo_Credito
      + ',Id_Caja = ' + Caja
      + ',Sub_Total=' + Invoice.Sub_Total
      + ',Total=' + Invoice.Total
      + ',Exonerada=' + Exoneracion.Exonerada
      + ',Exo_Numero_Documento=\'' + Exoneracion.Exo_Numero_Documento
      + '\',Exo_Nombre_Institucion=\'' + Exoneracion.Exo_Nombre_Institucion
      + '\',Exo_Fecha_Emision=\'' + Exoneracion.Exo_Fecha_Emision
      + '\',Exo_Porcentaje=' + Exoneracion.Exo_Porcentaje
      + ',Id_Caja_Diaria=' + Invoice.Id_Caja_Diaria
      + ',Exo_Monto=' + Exoneracion.Exo_Monto
      + ',Creado_El=\'' + Invoice.Creado_El
      + '\',Notas=\'' + Invoice.Notas 
      + '\',Actividad_Economica_Clientes=\'' + Invoice.Actividad_Economica 
      + '\',Actividad_Economica_Empresa=\'' + Invoice.Actividad_Economica_Empresa 
      + '\'',
      where: 'Id_Factura =' + Invoice.Id_Factura
    };
    return await this.apiService.updateRecord(sqlActualizarFactura);
  }
  async deleteDetails(Id_Factura,Lista){
    let sql = "DELETE FROM Ven_Factura_Detalle WHERE Id_Factura = " + Id_Factura + " and Id_Factura_Detalle Not In (" + Lista + ")";
    return await this.apiService.postRecord(sql);
   // return await this.apiService.executeSqlSyn(sql);
  }
  async insertDetail(Detail,Id_Factura){
    let sqlFacturaDetalle = {
      table: 'Ven_Factura_Detalle',
      fields: 'Id_Factura,Id_Producto,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,IVA,Sub_Total,Total,Tasa,Tipo_Impuesto,SKU,Adicional',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Id_Factura
      + '\',\'' + Detail.Id_Producto
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
      + '\',\'' +  Detail.Tipo_Impuesto
      + '\',\'' +  Detail.SKU
      + '\',\'' +  Detail.Adicional
      + '\''
    };
    return await this.apiService.insertRecord(sqlFacturaDetalle);
  }
  async updateDetail(Detail){
    let sqlActualizarFactura = {
      table: 'Ven_Factura_Detalle',
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
      + '\',Tasa = \'' + Detail.IVAPorcentaje
      + '\',Tipo_Impuesto = \'' + Detail.Tipo_Impuesto
      + '\',SKU=\'' + Detail.SKU
      + '\',Adicional=\'' + Detail.Adicional + '\'',
      where: 'Id_Factura_detalle =' + Detail.Id_Factura_detalle
    };
    return await this.apiService.updateRecord(sqlActualizarFactura);
  }
  async getRegimen(){
    let sql = "SELECT Regimen FROM Gen_Empresa WHERE Id_Empresa=" + localStorage.getItem("Id_Empresa");;
    return await this.apiService.postRecord(sql);
  }
  async loadCaja(){
    let sql = "SELECT Id_Caja From Ven_Caja where Id_Empresa = " + localStorage.getItem("Id_Empresa");
    return await this.apiService.postRecord(sql);
  }
  async updateInvoiceStatus(Id_Factura){
    let sql = "Update Ven_Factura set Respuesta_MH = 'aplicado' where Id_Factura = "+ Id_Factura;
    return await this.apiService.postRecord(sql);
  }
  async ObtenerTC(fecha){
    let sqlProducto = {
      table: 'Gen_Tipo_Cambio',
      fields: 'Compra as compra,Venta as venta,Fecha as fecha',
      where: "Fecha = '"+ fecha + "'"
     };
     return await this.apiService.executeSqlSyn(sqlProducto);
  }
  async GrabarTC(tipoCambio){
    let sqlCliente = {
      table: 'Gen_Tipo_Cambio',
      fields: 'Compra,Venta,Fecha',
      // tslint:disable-next-line: max-line-length
      values: '\'' + tipoCambio.compra + '\',\'' + tipoCambio.venta + '\',\'' + tipoCambio.fecha + '\''
    };
    return await this.apiService.insertRecord(sqlCliente);
  }
  async LoadIVAIncludio(){
    let sql = "Select Valor From Gen_Parametros_Compania where Parametro = 'Ven_Iva_Incluido' and  Id_Empresa = "+ localStorage.getItem('Id_Empresa') +";";
    return await this.apiService.postRecord(sql);
  }
  async LoadActividadEconomica(){
    if(localStorage.getItem('Actividad')){
      return localStorage.getItem('Actividad');
    }else{
      let sql = "Select Codigo_Actividad From Gen_Empresa Where Id_Empresa = " + localStorage.getItem("Id_Empresa");
      let data = await this.apiService.postRecord(sql);
      localStorage.setItem('Actividad',data['data'][0]['Codigo_Actividad']);
      return data['data'][0]['Codigo_Actividad'];
    }
  }
}
