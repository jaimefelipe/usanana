import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private apiService: ApiService) { }
  async getProducts(){
    let data:any;
    //let sql = " select Id_Producto,Tipo_Codigo,Descripcion,Precio,Foto,Url,KeyWords,Contenido,Description, 0 as Seleccionado from Inv_Producto where Estado = 1 and id_empresa = 7";
    //let sql = " select Id_Producto,Tipo_Codigo,Descripcion,Precio,Foto,Url, 0 as Seleccionado from Inv_Producto where Estado = 1 and Id_empresa = 7";
    let sql = "Select * from Inv_Producto where Estado = 1 and Id_Empresa = 7";
    data = await this.apiService.postRecord(sql);
    return data;
  }
  async getProduct(url){
    let data:any;
    let sql = " select Id_Producto,Tipo_Codigo,Descripcion,Precio,Foto,Url,KeyWords,Contenido, Description from Inv_Producto where Url='"+url+"'";
    data = await this.apiService.postRecord(sql);
    return data;
  }
}
