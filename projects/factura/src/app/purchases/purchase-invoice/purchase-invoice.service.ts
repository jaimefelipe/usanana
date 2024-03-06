import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseInvoiceService {

  constructor(private apiService: ApiService) {}
  async loadInvoices(paginacion,search?){
    let sqlConfig = {
      table: 'Com_Factura',
      fields: 'Id_Factura,Consecutivo,Creado_El,Tipo_Documento,Nombre,Numero_Identificacion,Respuesta_MH,Error_MH,Fecha,Clave_Numerica,Sub_Total,IVA',
      orderField: 'Fecha',
      searchField: search,
      paginacion: paginacion,
      orderDirection:' DESC '
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadInvoice(Id_Factura){
    let sqlConfig = {
      table: 'Com_Factura',
      fields: 'Id_Factura,Tipo_Documento,Nombre,Codigo_Identificacion,Numero_Identificacion,Correo,Condicion_Venta,Plazo_Credito,Metodo_Pago,Moneda,Tipo_Cambio,IVA,Sub_Total,Total,Respuesta_MH,Consecutivo,Creado_El,Notas,Fecha',
      orderField: '',
      searchField: '',
      where: 'Id_Factura = ' + Id_Factura
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadInvoiceDetails(Id_Factura){
    let sqlConfig = {
      table: 'Com_Factura_Detalle inner join Inv_Producto on Com_Factura_Detalle.Id_Producto = Inv_Producto.Id_Producto  ',
      fields: 'Id_Factura_detalle,Id_Factura,Com_Factura_Detalle.Id_Producto,Com_Factura_Detalle.SKU,Com_Factura_Detalle.Codigo_Proveedor,Codigo_Referencia,Com_Factura_Detalle.Descripcion,Com_Factura_Detalle.Unidad_Medida,Cantidad,Com_Factura_Detalle.Precio,Descuento,IVA,Sub_Total,Total,Com_Factura_Detalle.Estado,Com_Factura_Detalle.Id_Empresa,Tasa as IVAPorcentaje,Com_Factura_Detalle.Tipo_Impuesto,Inv_Producto.Id_Producto as Id_Prod',
      orderField: '',
      searchField: '',
      where: 'Id_Factura = ' + Id_Factura
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async validClient(Numero_Identificacion){
    let sqlCedula = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre,Correo,Identificacion,Tipo_Identificacion,Condicion_Venta,Plazo_Credito,Metodo_Pago,Estado',
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
  async loadProductLike(producto){
    let sqlProducto = {
      table: 'Inv_Producto',
      fields: 'Id_Producto,Codigo,SKU,Tipo_Codigo,Descripcion,Unidad_Medida,Categoria,Impuesto,Tipo_Impuesto,Precio,Moneda,Estado,Ultimo_Costo',
      where: '( Id_Producto like \'---' + producto + '---\' or Descripcion like \'---' + producto + '---\' or SKU like \'---' + producto + '---\' or Codigo like \'---' + producto + '---\') and Estado = 1'
     };
     return await this.apiService.executeSqlSyn(sqlProducto);
  }
  async loadProduct(producto){
    let sqlProducto = {
      table: 'Inv_Producto',
      fields: 'Id_Producto,Codigo,SKU,Tipo_Codigo,Descripcion,Unidad_Medida,Categoria,Impuesto,Tipo_Impuesto,Precio,Moneda,Estado,Ultimo_Costo',
      where: '( SKU = \'' + producto + '\' )'
     };
     return await this.apiService.executeSqlSyn(sqlProducto);
  }
  async insertClient(Invoice){
    let sqlCliente = {
      table: 'Gen_Persona',
      fields: 'Nombre,Correo,Identificacion,Tipo_Identificacion,Condicion_Venta,Plazo_Credito,Metodo_Pago,Estado',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Invoice.Nombre + '\',\'' + Invoice.Correo + '\',\'' + Invoice.Numero_Identificacion + '\',\'' + Invoice.Codigo_Identificacion + '\',\'01\',0,\'01\',1'
    };
    return await this.apiService.insertRecord(sqlCliente);
  }
  async insertHeader(Invoice,Caja){
    let sqlInvoice = {
      table: 'Com_Factura',
      fields: 'Id_Cliente,Id_Caja,Nombre,Correo,Numero_Identificacion,Codigo_Identificacion,Metodo_Pago,Plazo_Credito,Condicion_Venta,IVA,Sub_Total,Total,Tipo_Documento,Moneda,Tipo_Cambio,Consecutivo,Clave_Numerica,Fecha,Respuesta_MH,Notas',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Invoice.Id_Cliente
      + '\',\'' + Caja
      + '\',\'' + Invoice.Nombre
      + '\',\'' + Invoice.Correo
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
      + '\',\'' + Invoice.Tipo_Cambio
      + '\',\'' + Invoice.Consecutivo
      + '\',\'' + Invoice.Clave_Numerica
      + '\',\'' + Invoice.Fecha
      + '\',\'Registrado\',\''
      + Invoice.Notas + '\''
    };
    return await this.apiService.insertRecord(sqlInvoice);
  }
  async updateHeader(Invoice,Caja){
    let sqlActualizarFactura = {
      table: 'Com_Factura',
      // tslint:disable-next-line: max-line-length
      fields: 'Creado_El=NOW(), Id_Cliente = ' + Invoice.Id_Cliente
      + ',Tipo_Documento = \'' + Invoice.Tipo_Documento
      + '\',Nombre = \'' + Invoice.Nombre
      + '\',Fecha = \'' + Invoice.Fecha
      + '\',Clave_Numerica = \'' + Invoice.Clave_Numerica
      + '\',Consecutivo = \'' + Invoice.Consecutivo
      + '\',Codigo_Identificacion = \'' + Invoice.Codigo_Identificacion
      + '\',Numero_Identificacion = \'' + Invoice.Numero_Identificacion
      + '\',Correo = \'' + Invoice.Correo
      + '\',Metodo_Pago = \'' + Invoice.Metodo_Pago
      + '\',Moneda = \'' + Invoice.Moneda
      + '\',IVA = \'' + Invoice.IVA
      + '\',Condicion_Venta = \'' + Invoice.Condicion_Venta
      + '\',Plazo_Credito = ' + Invoice.Plazo_Credito
      + ',Id_Caja = ' + Caja
      + ',Sub_Total=' + Invoice.Sub_Total
      + ',Total=' + Invoice.Total
      + ',Notas=\'' + Invoice.Notas + '\'',
      where: 'Id_Factura =' + Invoice.Id_Factura
    };
    return await this.apiService.updateRecord(sqlActualizarFactura);
  }
  async deleteDetails(Id_Factura,Lista){
    let sql = "DELETE FROM Com_Factura_Detalle WHERE Id_Factura=" + Id_Factura + " and Id_Factura_Detalle Not In (" + Lista + ")";
    return await this.apiService.postRecord(sql);
   // return await this.apiService.executeSqlSyn(sql);
  }

  async insertDetail(Detail,Id_Factura,Inventario){
    let sqlFacturaDetalle = {
      table: 'Com_Factura_Detalle',
      fields: 'Id_Factura,Id_Producto,Tipo_Codigo,Codigo_Referencia,Descripcion,Unidad_Medida,Cantidad,Precio,IVA,Sub_Total,Total,Tasa,Tipo_Impuesto,SKU,Codigo_Proveedor,Precio_Sin_Descuento,Descuento,Detalle_Descuento',
      // tslint:disable-next-line: max-line-length
      values: '\'' + Id_Factura
      + '\',\'' + Detail.Id_Producto
      + '\',\'1\',\'' + Detail.Codigo_Referencia
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
      + '\',\'' +  Detail.Codigo_Proveedor
      + '\',\'' +  Detail.Precio_Sin_Descuento
      + '\',\'' +  Detail.Descuento
      + '\',\'' +  Detail.Detalle_Descuento
      + '\''
    };
    return await this.apiService.insertRecord(sqlFacturaDetalle);
  }
  async updateDetail(Detail){
    let sqlActualizarFactura = {
      table: 'Com_Factura_Detalle',
      // tslint:disable-next-line: max-line-length
      fields: 'Id_Producto = ' + Detail.Id_Producto
      + ',Tipo_Codigo = \'' + '1'
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
      + '\',Codigo_Proveedor = \'' + Detail.Codigo_Proveedor
      + '\',Precio_Sin_Descuento = \'' + Detail.Precio_Sin_Descuento
      + '\',Descuento = \'' + Detail.Descuento
      + '\',Detalle_Descuento = \'' + Detail.Detalle_Descuento
      + '\',SKU=\'' + Detail.SKU + '\'',
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
  async getCiaID(){
    let sql = "Select Numero_Identificacion from Gen_Empresa where Id_Empresa = " + localStorage.getItem('Id_Empresa');
    return await this.apiService.postRecord(sql);
  }
  async getInvoiceNumber(Clave_Numerica,Cliente){
    let sql = "Select Id_Factura from Com_Factura where Clave_Numerica = '"+Clave_Numerica+"' and Numero_Identificacion = '"+Cliente+"'";
    return await this.apiService.postRecord(sql);
  }
  
  xml2json(xml){
    try {
      const types = [null,
        "Element",
        "Attribute",
        "Text",
        "CDATA",
        "EntityReference", // Deprecated
        "Entity", // Deprecated
        "ProcessingInstruction",
        "Comment",
        "Document",
        "DocumentType",
        "DocumentFragment",
        "Notation" // Deprecated
      ];
  
      var o = {
        name: xml.nodeName,
        type:  types[xml.nodeType],
        text: '',
        attributes : {},
        children: []
      };
      
      if (xml.nodeType == 3 ||
          xml.nodeType == 4 ||
          xml.nodeType == 8 ) {
        o.text = xml.textContent;
      } else {
        if (xml.attributes) {
          o.attributes = {};
          for (const a of xml.attributes) {
            o.attributes[a.name] = a.value;
          }
        }
  
        if (xml.childNodes.length) {
          o.children = [];
          for (const x of xml.childNodes) {
            o.children.push(this.xml2json(x))
          }
        }
      }
      return (o);
    } catch (e) {
      alert('Error in xml2json. See console for details.');
      console.log('Error in xml2json processing node:');
      console.log(o);
      console.log('Error:');
      console.log(e);
      return true;
    }
  }
  


}
