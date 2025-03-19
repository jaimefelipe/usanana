import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantConsultaPedidoService {

constructor(private apiService: ApiService) { }

async loadPedidos(paginacion,search?) {
  let sqlConfig = {
    table: 'Res_Pedido Inner Join Res_Zona on Res_Pedido.Id_Zona = Res_Zona.Id_Zona inner Join Res_Mesa on Res_Pedido.Id_Mesa = Res_Mesa.Id_Mesa',
    fields: 'Id_Pedido,Res_Mesa.Nombre as Mesa,Res_Zona.Nombre as Zona,Res_Pedido.Nombre,Res_Pedido.Estado,Res_Pedido.Creado_El,Id_Factura,Id_Caja_Diaria,Total,Metodo_Pago,Facturado_EL',
    orderField: '',
    searchField: search,
    paginacion: paginacion
    //where:"Res_Pedido.Estado = 3 and Metodo_Pago = 02 AND Id_Factura IS NULL"
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}
async loadPedido(Id_Pedido){
  let sqlConfig = {
    table: 'Res_Pedido Inner Join Res_Zona on Res_Pedido.Id_Zona = Res_Zona.Id_Zona inner Join Res_Mesa on Res_Pedido.Id_Mesa = Res_Mesa.Id_Mesa',
    fields: 'Id_Pedido,Res_Mesa.Nombre as Mesa,Res_Zona.Nombre as Zona,Res_Pedido.Nombre,Res_Pedido.Estado,Res_Pedido.Creado_El,Id_Factura,Id_Caja_Diaria,Total,Res_Pedido.Creado_Por,Metodo_Pago',
    where:'Id_Pedido =' + Id_Pedido
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}
async loadPedidoDetalle(Id_Pedido){
  let sqlConfig = {
    table: 'Res_Pedido Inner Join Res_Zona on Res_Pedido.Id_Zona = Res_Zona.Id_Zona inner Join Res_Mesa on Res_Pedido.Id_Mesa = Res_Mesa.Id_Mesa',
    fields: 'Id_Pedido,Res_Mesa.Nombre as Mesa,Res_Zona.Nombre as Zona,Res_Pedido.Nombre,Res_Pedido.Estado,Res_Pedido.Creado_El,Id_Factura,Id_Caja_Diaria,Total,Res_Pedido.Creado_Por',
    where:'Id_Pedido =' + Id_Pedido
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}
async carcarScript(url,Id){
  return await this.apiService.postScript(url,Id);
}
async ActualizarFechaPedido(Fecha,Id_Factura){
  let sql = `Update Ven_Factura Set
  Creado_El ='`+Fecha
  +`' where Id_Factura=`+Id_Factura;
  await this.apiService.postRecord(sql);

}
}
