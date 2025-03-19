import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private apiService: ApiService) { }
  async getProducts(Id_Categoria?){
    let data:any;
    let sql = "Select Id_Producto,Descripcion,Precio,Categoria,Impuesto from Inv_Producto where Estado = 1 and Id_Empresa = 7 and Categoria = "+ Id_Categoria;
    data = await this.apiService.postRecord(sql);
    return data;
  }
  async getProduct(url){
    let data:any;
    let sql = " select Id_Producto,Tipo_Codigo,Descripcion,Precio,Foto,Url,KeyWords,Contenido, Description from Inv_Producto where Url='"+url+"'";
    data = await this.apiService.postRecord(sql);
    return data;
  }
  async getGategoria(){
    let data:any;
    let sql = "Select Id_Categoria,Nombre,Factura,POV,Bar,Conta from Inv_Categoria where Estado = 1 and Id_Empresa = 7";
    data = await this.apiService.postRecord(sql);
    return data;
  }
}
