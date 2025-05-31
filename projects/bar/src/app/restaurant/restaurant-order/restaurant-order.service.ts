import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantOrderService {
  constructor(private apiService: ApiService) {}
  async LoadPedidos(){
    let sql = "Select Id_Mesa,Id_Mesa as Nombre,Estado,'Orden' as Zona from Res_Pedido where Estado !=3 and Creado_El >= DATE_FORMAT(concat(Year(Now()),'-',month(Now()),'-',day(Now()),' 00:00:00'),'%Y-%m-%d %H:%i:%s') and Creado_El <=DATE_FORMAT(concat(Year(Now()),'-',month(Now()),'-',day(Now()),' 23:59:59'),'%Y-%m-%d %H:%i:%s') and Id_Compania ="+localStorage.getItem('Id_Compania');
    return await this.apiService.postRecord(sql);
  }
  async LoadNumber(){
    let sql = "select IFNULL(COUNT(Id_Pedido),0) +1 as Numero from Res_Pedido where Id_Empresa = "+ localStorage.getItem('Id_Empresa') +" and Creado_El >= DATE_FORMAT(concat(Year(Now()),'-',month(Now()),'-',day(Now()),' 00:00:00'),'%Y-%m-%d %H:%i:%s') and Creado_El <=DATE_FORMAT(concat(Year(Now()),'-',month(Now()),'-',day(Now()),' 23:59:59'),'%Y-%m-%d %H:%i:%s');";    return await this.apiService.postRecord(sql);
  }
  async placeOccuped(Id_Mesa){
    let sql = "UPDATE Res_Mesa SET ESTADO = 2 WHERE Id_Mesa = " + Id_Mesa;
    return await this.apiService.postRecord(sql);
  }
  async placeFree(Id_Mesa){
    let sql = "UPDATE Res_Mesa SET ESTADO = 1 WHERE Id_Mesa = " + Id_Mesa;
    return await this.apiService.postRecord(sql);
  }
  async closeOrder(Id_Pedido){
    let sql = 'Update Res_Pedido set Estado = 2 where Id_Pedido = ' + Id_Pedido
    return await this.apiService.postRecord(sql);
  }
  async updateTotal(Id_Producto,Id_Pedido,Total){
    let sql = 'Update Res_Pedido_Detalle set Total = ' + Total +', Precio = ' + Total +' where Id_Pedido = ' + Id_Pedido + ' and Id_Producto = ' + Id_Producto;
    return await this.apiService.postRecord(sql);
  }
  async newOrder(Order){
    let sql = {
      table: 'Res_Pedido',
      fields: 'Id_Mesa,Id_Zona,Estado,Tipo_Cuenta,Numero,Nombre',
      values: '\'' + Order.Id_Place
      + '\',\'' + Order.Id_Zona
      + '\',\'' + 1
      + '\',\'' + Order.Tipo_Cuenta
      + '\',\'' + Order.Id_Place
      + '\',\'' + Order.Nombre
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async loadComponete(Id_Producto,tipo){
    if(tipo = 1){
      let campo = 'Opcional';
    }else{
      let campo = 'Adicional';
    }
    let sql = "Select Id_Producto_Componente,Nombre,Grupo,0 as Selected,'' as Id_Producto_Sub_Componente,'' as Nombre_Sub_Componente,Precio From Inv_Producto_Componente Where Opcional = 1 and Id_Producto = " + Id_Producto + ' order by Grupo';
    return await this.apiService.postRecord(sql);
  }
  async loadSubComponete(Id_Producto_Componente){
    let sql = "Select Id_Producto_Sub_Componente, Nombre From Inv_Producto_Sub_Componente where Id_Producto_Componente = " + Id_Producto_Componente;
    return await this.apiService.postRecord(sql);
  }
  async loadOrder(Id_Mesa){
    let sql = "Select Id_Pedido,Id_Mesa,Id_Zona,Tipo_Cuenta,Nombre,Iva,Total From Res_Pedido Where Estado = 1 and Id_Mesa = " + Id_Mesa;
    return await this.apiService.postRecord(sql);
  }

  async addProduct(Product,Id_Pedido){
    let Cantidad = 1;
    let Sub_Total = 0;
    let Iva = 0;
    let Total = 0;
    let Monto_Servicio = 0
    if(Product.Cantidad > 0){
      Cantidad = parseInt(Product.Cantidad);
    }
    Sub_Total = parseFloat(Product.Precio) * Cantidad;
    //Recalcular Iva y Total.
    Iva = (Sub_Total * parseFloat(Product.Impuesto)) / 100;
    Total = Sub_Total + Iva;
    Product.Sub_Total = Sub_Total;
    Product.Cantidad = Cantidad;
    Product.Iva = Iva;
    Product.Total = Total;

    //Redondear
    let sql = {
      table: 'Res_Pedido_Detalle',
      fields: 'Id_Producto,Id_Pedido,Cuenta,Cantidad,Precio,Sub_Total,IVA,Tarifa_IVA,Total,Estado,Facturado',
      values: '\'' + Product.Id_Producto
      + '\',\'' + Id_Pedido
      + '\',\'' + 1
      + '\',\'' + Cantidad
      + '\',\'' + Product.Precio
      + '\',\ROUND(' + Sub_Total
      + ',2),ROUND(' + Iva
      + ',2),\'' + Product.Impuesto
      + '\',ROUND(' + Total
      + ',2),\'' + 1
      + '\',\'' + 0
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async addComponente(Componente){
    let sql = {
      table: 'Res_Pedido_Detalle_Alterno',
      fields: 'Id_Pedido_Detalle,Id_Producto_Componente,Id_Producto_Sub_Componente,Adicional',
      values: '\'' + Componente.Id_Pedido_Detalle
      + '\',\'' + Componente.Id_Producto_Componente
      + '\',\'' + Componente.Id_Producto_Sub_Componente
      + '\',\'' + Componente.Adicional + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async loadOrderProducts(Id_Order){
    let sql = `Select Id_Pedido_Detalle,Res_Pedido_Detalle.Id_Producto,Cuenta,Cantidad,Facturado,Cantidad-Facturado as Facturar,Res_Pedido_Detalle.Estado,Descripcion,Res_Pedido_Detalle.Precio,Res_Pedido_Detalle.Sub_Total,Res_Pedido_Detalle.IVA,Res_Pedido_Detalle.Total, Notas, Cocina,Inv_Producto.Impuesto,Inv_Producto.Codigo,TieneComponentes
    from Res_Pedido_Detalle
    inner Join Inv_Producto on Res_Pedido_Detalle.Id_Producto = Inv_Producto.Id_Producto
    inner Join Inv_Categoria on Inv_Producto.Categoria = Inv_Categoria.Id_Categoria
    Where Res_Pedido_Detalle.Estado <> 3 and Cantidad > 0 and Id_Pedido = ` + Id_Order;
    return await this.apiService.postRecord(sql);
  }
  async loadPedidoDetalleAlterno(Id_Pedido_Detalle){
    let sql = ` SELECT Id_Pedido_Detalle_Alterno
    ,Id_Pedido_Detalle
    ,Res_Pedido_Detalle_Alterno.Adicional,
    Inv_Producto_Componente.Nombre as Componente,
    Inv_Producto_Sub_Componente.Nombre as Sub_Componente
    FROM Res_Pedido_Detalle_Alterno
    inner Join Inv_Producto_Componente
    on Res_Pedido_Detalle_Alterno.Id_Producto_Componente = Inv_Producto_Componente.Id_Producto_Componente
    left Join Inv_Producto_Sub_Componente on Res_Pedido_Detalle_Alterno.Id_Producto_Sub_Componente = Inv_Producto_Sub_Componente.Id_Producto_Sub_Componente
    Where Id_Pedido_Detalle = ` + Id_Pedido_Detalle ;
    //+ ' and Inv_Producto_Componente.Adicional = 1'
    return await this.apiService.postRecord(sql);
  }
  async addProductToProduct(Id_Pedido_Detalle){
    let sql = "Update Res_Pedido_Detalle Set Cantidad = Cantidad + 1, Sub_Total = ROUND(Precio * Cantidad,2), IVA = ROUND((Sub_Total * Tarifa_IVA / 100),2), Total = ROUND((Sub_Total + IVA),2) Where Id_Pedido_Detalle = " + Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }
  async menusProductToProduct(Id_Pedido_Detalle){
    let sql = "Update Res_Pedido_Detalle Set Cantidad = Cantidad - 1, Sub_Total = ROUND(Precio * Cantidad,2), IVA = ROUND((Sub_Total * Tarifa_IVA / 100),2), Total = ROUND((Sub_Total + IVA),2) Where Id_Pedido_Detalle = " + Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }
  async updateProductTotal(Id_Pedido_Detalle){
    let sql = "Update Res_Pedido_Detalle Set Sub_Total = ROUND(Precio * Cantidad,2), IVA = ROUND((Sub_Total * Tarifa_IVA / 100),2), Total = ROUND((Sub_Total + IVA),2) Where Id_Pedido_Detalle = " + Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }

  async UpdateProductPrice(Id_Pedido_Detalle,Precio,Cantidad,Total){
    let sql = "Update Res_Pedido_Detalle Set Precio = "+Precio+",Total = "+Total+",Cantidad ="+Cantidad+" Where Id_Pedido_Detalle = " + Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }
  async ceroProductToProduct(Id_Pedido_Detalle,Estado){
    let sql = "Update Res_Pedido_Detalle Set Estado = "+Estado+",Cantidad = 0 Where Id_Pedido_Detalle = " + Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }
  async updateNote(Nota,Id_Pedido_Detalle){
    let sql = "Update Res_Pedido_Detalle Set Notas = '"+ Nota +"' Where Id_Pedido_Detalle = " + Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }
  //Leer Parametro de Multi Usuario
  async LoadParameMultiUser(){
    let sql = "Select Valor From Gen_Parametros_Compania where Parametro = 'Bar_Multi_Usuario' and  Id_Empresa = "+ localStorage.getItem('Id_Empresa') +";";
    return await this.apiService.postRecord(sql);
  }
  async LoadSalonero(Salonero){
    let sql = "Select Id_Usuario,Nombre_Usuario From Seg_Usuario where Salonero = '"+Salonero+"'";
    return await this.apiService.postRecord(sql);
  }
  async LoadSupervisor(Salonero){
    let sql = "Select Id_Usuario,Nombre_Usuario From Seg_Usuario where Master = 1 and Salonero = '"+Salonero+"'";
    return await this.apiService.postRecord(sql);
  }
  async UpdateOrderTotal(Sub_Total,IVA,Total,Id_Pedido){
    let sql = "Update Res_Pedido set Sub_Total ="+ Sub_Total + ", IVA = "+ IVA + ",Total =" + Total + " Where Id_Pedido = " +  Id_Pedido;
    return await this.apiService.postRecord(sql);
  }
  
}
