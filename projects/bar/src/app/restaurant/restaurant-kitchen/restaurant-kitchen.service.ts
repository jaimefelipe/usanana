import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantKitchenService {

  constructor(private apiService: ApiService) {}
  
  async loadComandas(){
    let sql = `Select Res_Pedido_Detalle.Id_Pedido,Id_Pedido_Detalle,Res_Pedido_Detalle.Id_Producto,Notas,Cantidad, Inv_Producto.Descripcion, Inv_Categoria.Nombre,Res_Zona.Nombre as Zona, Res_Mesa.Nombre as Mesa,
    cast(Res_Pedido_Detalle.Creado_El as time) as Hora
    From Res_Pedido_Detalle
    inner join Res_Pedido on Res_Pedido_Detalle.Id_Pedido = Res_Pedido.Id_Pedido
    inner join Res_Zona on Res_Pedido.Id_Zona = Res_Zona.Id_Zona
    inner join Res_Mesa on Res_Pedido.Id_Mesa = Res_Mesa.Id_Mesa
    inner Join Inv_Producto On Res_Pedido_Detalle.Id_Producto = Inv_Producto.Id_Producto
    inner Join Inv_Categoria on Inv_Producto.Categoria = Inv_Categoria.Id_Categoria
    where Res_Pedido_Detalle.Estado = 1 and Inv_Categoria.Cocina = 1 and Res_Pedido_Detalle.Id_Empresa = ` + localStorage.getItem('Id_Empresa')+`
    group by  Id_Pedido
    order by Res_Pedido_Detalle.Creado_El Asc
    ` ;
    return await this.apiService.postRecord(sql);
  }
  async loadDetalles(Id_Pedido){
    let sql = `Select  Id_Pedido_Detalle,Res_Pedido_Detalle.Id_Producto,Notas,Cantidad, Inv_Producto.Descripcion, Inv_Categoria.Nombre
    From Res_Pedido_Detalle
    inner Join Inv_Producto On Res_Pedido_Detalle.Id_Producto = Inv_Producto.Id_Producto
    inner Join Inv_Categoria on Inv_Producto.Categoria = Inv_Categoria.Id_Categoria
    where Res_Pedido_Detalle.Estado = 1 and Inv_Categoria.Cocina = 1 and Res_Pedido_Detalle.Id_Empresa = 1020 and Id_Pedido = `+Id_Pedido;
    return await this.apiService.postRecord(sql);
  }

  async endComanda(Id_Pedido_Detalle){
    let sql = "Update Res_Pedido_Detalle Set Estado = 2 Where Id_Pedido = " + Id_Pedido_Detalle;
    return await this.apiService.postRecord(sql);
  }

}
