import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantInvoiceService {

  constructor(private apiService: ApiService) {}

  async loadOrders(zonas,Tipo){
    let Estado = '(Res_Pedido.Estado = 1 or Res_Pedido.Estado = 2)'
    if(Tipo == 2){
      Estado = 'Res_Pedido.Estado = 3';
    }
    let sql ='';
    if(zonas == false){
      sql = `Select Id_Pedido,Res_Pedido.Id_Mesa,Res_Pedido.Id_Zona,Tipo_Cuenta, 'Pedido' as Zona,Metodo_Pago, Numero as Mesa, Estado, Id_Factura,Creado_Por
      from Res_Pedido
      where `+Estado+` and Res_Pedido.Id_Empresa = ` + localStorage.getItem('Id_Empresa');
    }else{
      sql = `Select Id_Pedido,Res_Pedido.Id_Mesa,Res_Pedido.Id_Zona,Tipo_Cuenta, Res_Zona.Id_Zona,Res_Zona.Nombre as Zona,Metodo_Pago, Res_Mesa.Nombre as Mesa, Res_Pedido.Estado, Res_Pedido.Id_Factura,Res_Pedido.Nombre as Cliente,Res_Pedido.Creado_Por
      from Res_Pedido
      inner Join Res_Zona on Res_Pedido.Id_Zona = Res_Zona.Id_Zona
      inner Join Res_Mesa on Res_Pedido.Id_Mesa = Res_Mesa.Id_Mesa
      where  `+Estado+` and Res_Pedido.Id_Empresa = ` + localStorage.getItem('Id_Empresa');
    }
    return await this.apiService.postRecord(sql);
  }
  async loadOrderDetails(Id_Pedido,Tipo){
    let Estado = ' Cantidad > 0 and ';
    if(Tipo == 1 ){
      Estado = '(Cantidad - IFNULL(Facturado,0)) > 0 and ';
    }
    let sql = `Select Id_Pedido_Detalle,Id_Pedido,Cuenta,Notas,Cantidad,Res_Pedido_Detalle.Precio,Inv_Producto.Descripcion,Inv_Categoria.Nombre, 0 as Facturar, Res_Pedido_Detalle.Id_Producto,Inv_Producto.Codigo,Facturado
    from Res_Pedido_Detalle
    inner join Inv_Producto on Res_Pedido_Detalle.Id_Producto = Inv_Producto.Id_Producto
    inner join Inv_Categoria on Inv_Producto.Categoria = Inv_Categoria.Id_Categoria
    Where `+Estado+` Id_Pedido = ` + Id_Pedido;
    return await this.apiService.postRecord(sql);
  }
  async updateAmount(Id_Pedido_Detalle, Cantidad){
    let sql = "Update Res_Pedido_Detalle set Facturado = Facturado + " + Cantidad + " where Id_Pedido_Detalle = " + Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }
  async updateStatus(Id_Pedido){
    let sql = 'Update Res_Pedido set Estado = 3, Facturado_Por = '+localStorage.getItem('Nombre_Usuario')+' Where Id_Pedido = ' + Id_Pedido;
    return await this.apiService.postRecord(sql);
  }
  async updatePlaceStatus(Id_Place){

  }
  async loadZones(paginacion,search?) {
    let sqlConfig = {
      table: 'Res_Zona',
      fields: 'Id_Zona,Nombre,Estado',
      orderField: '',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveZone(Zone){
    if(Zone.Id_Zona ==""){
      let sql = {
        table: 'Res_Zona',
        fields: 'Nombre,Estado',
        values: '\'' + Zone.Nombre
        + '\',\'' + Zone.Estado + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Res_Zona',
        fields: 'Nombre=\'' + Zone.Nombre
        + '\',Estado=\''+ Zone.Estado  + '\'',
        where: 'Id_Zona=' + Zone.Id_Zona
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadZone(Id_Zone){
    let sqlConfig = {
      table: 'Res_Zona',
      fields: 'Id_Zona,Nombre,Estado',
      orderField: '',
      searchField: '',
      where: "Id_Zona = " + Id_Zone
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async UpdateIdFactura(Id_Factura,Id_Pedido){
    let sql = {
      table: 'Res_Pedido',
      fields: 'Id_Factura=\'' + Id_Factura
       + '\'',
      where: 'Id_Pedido=' + Id_Pedido
    };
    return await this.apiService.updateRecord(sql);
  }

  async updatePlace(Id_Pedido,Id_Zona,Id_mesa){
    let sql = {
      table: 'Res_Pedido',
      fields: 'Id_Zona=\'' + Id_Zona
      + '\',Id_mesa=\''+ Id_mesa  + '\'',
      where: 'Id_Pedido=' + Id_Pedido
    };
    return await this.apiService.updateRecord(sql);
  }
}
