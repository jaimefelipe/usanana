import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(private apiService: ApiService) { }

  async loadCiaInfo() {
    let sql ="Select Nombre,Razon_Social,Telefono,Correo,Correo_Hacienda,Numero_Identificacion,Tipo_Identificacion,Provincia,Canton,Distrito,Barrio,Otras_Senas,Regimen,Api,Usuario_IDP,Clave_IDP,Ruta_P12,Pin_P12,Codigo_Actividad,Estado,Ruta_P12_Pruebas,Usuario_IDP_Pruebas,Clave_IDP_Pruebas,Pin_P12_Pruebas, Notas from Gen_Empresa where Id_Empresa=" +
      localStorage.getItem("Id_Empresa");
      return await this.apiService.postRecord(sql);
  }
  async getUserInfo(Id_User:string){
    let data:any;
    let sql = "Select Nombre, Correo, Telefono, Numero_Identificacion, Tipo_Cuenta, Tipo_Usuario, T4C3, Vence, CT4C3, Metodo_Pago From Seg_Usuario where Id_Usuario = '" + Id_User + "'";
    data = await this.apiService.postRecord(sql);
    return data;
  }
  async updateGeneralData(Empresa){
    let sql = "Update Gen_Empresa SET  Nombre ='" + Empresa.Nombre
    + "', Razon_Social = '" + Empresa.Razon_Social
    + "', Tipo_Identificacion = '" + Empresa.Tipo_Identificacion
    + "', Numero_Identificacion = '" + Empresa.Numero_Identificacion
    + "', Telefono = '" + Empresa.Telefono
    + "', Correo = '" + Empresa.Correo
    + "' Where Id_Empresa = '" + localStorage.getItem("Id_Empresa") + "'";
    return await this.apiService.postRecord(sql);
  }
  async updateAddress(Empresa){
    let sql = "Update Gen_Empresa SET  Provincia ='" + Empresa.Provincia
    + "', Canton = '" + Empresa.Canton
    + "', Distrito = '" + Empresa.Distrito
    + "', Barrio = '" + Empresa.Barrio
    + "', Otras_Senas = '" + Empresa.Otras_Senas
    + "', Notas = '" + Empresa.Notas
    + "' Where Id_Empresa = '" + localStorage.getItem("Id_Empresa") + "'";
    return await this.apiService.postRecord(sql);
  }
  async updateHacienda(Empresa){
    let sql = "Update Gen_Empresa SET  Correo_Hacienda ='" + Empresa.Correo_Hacienda
    + "', Codigo_Actividad = '" + Empresa.Codigo_Actividad
    + "', Regimen = '" + Empresa.Regimen
    + "', Api = '" + Empresa.Api
    + "', Usuario_IDP = '" + Empresa.Usuario_IDP
    + "', Clave_IDP = '" + Empresa.Clave_IDP
    + "', Ruta_P12 = '" + Empresa.Ruta_P12
    + "', Pin_P12 = '" + Empresa.Pin_P12
    + "' Where Id_Empresa = '" + localStorage.getItem("Id_Empresa") + "'";
    return await this.apiService.postRecord(sql);
  }
  async updateUserInfo(User:any,Id_User:string){
    //Actualizar la información del Usuario
    let sql = "Update Seg_Usuario set Nombre = '" + User.Nombre
    + "', Correo = '" + User.Correo
    + "', Telefono = '" + User.Telefono
    + "', Numero_Identificacion = '" + User.Numero_Identificacion
    + "', Tipo_Cuenta = '" + User.Tipo_Cuenta
    + "', Tipo_Usuario = '" + User.Tipo_Usuario
    + "' Where Id_Usuario = '" + Id_User + "'"
    let data = await this.apiService.postRecord(sql);

    if(User.Tipo_Cuenta == '0'){
      //Actualizar Datos en tabla de compañia.
      sql = "Update Gen_Empresa set Nombre ='" + User.Nombre
      + "', Razon_Social = '" + User.Nombre
      + "', Correo = '" + User.Correo
      + "', Telefono = '" + User.Telefono
      + "', Numero_Identificacion = '" + User.Numero_Identificacion
      + "', Tipo_Identificacion = '01"
      + "' Where Id_Empresa = '" + localStorage.getItem("Id_Empresa") + "'";
      let data1 = await this.apiService.postRecord(sql);
    }
    return data;
  }
  async updateSalesInfo (User:any,Id_User:string){
    let sql = "Update Seg_Usuario set T4C3 = '" + User.T4C3
    + "', Vence = '" + User.Vence
    + "', CT4C3 = '" + User.CT4C3
    + "', Metodo_Pago = '" + User.Metodo_Pago
    + "' Where Id_Usuario = '" + Id_User + "'"
    let data = await this.apiService.postRecord(sql);
    return data;
  }
  async loadProductsForCompany(){
    let sql = " Select Id_Producto, Id_Sub_Categoria from Inv_Producto_Empresa where Id_Empresa = " + localStorage.getItem('Id_Empresa');
    let data = await this.apiService.postRecord(sql);
    return data;
  }

  async getProductByCompany(){
    let sql = "Select Id_Producto,Id_Sub_Categoria from Inv_Producto_Empresa where Id_Empresa=" + localStorage.getItem('Id_Empresa');
    let data = await this.apiService.postRecord(sql);
    return data;
  }

  async updateCategoryToProductCompany(Product,Category){
    let sql = "Update Inv_Producto_Empresa set Id_Sub_Categoria = " + Category + " where Id_Empresa = " + localStorage.getItem('Id_Empresa') + " and Id_Producto = " + Product;
    let data = await this.apiService.postRecord(sql);
    return true;
  }
  async addProductToCompany(Product,Category){
    let sql = "Insert Into Inv_Producto_Empresa (Id_Empresa,Id_Producto,Id_Sub_Categoria,Creado_El,Creado_Por) values ("
    +localStorage.getItem('Id_Empresa')
    + "," + Product + ","
    + Category + ",NOW(),'System')";
    let data = await this.apiService.postRecord(sql);
    return true;
  }
  async getCategoryForProduct(Product:any){
    //let sql = "select Inv_Producto_Sub_Categoria.Id_Sub_Categoria,Inv_Sub_Categoria.Nombre, ((Inv_Producto.Precio * Inv_Producto_Sub_Categoria.Porcentaje) /100) Precio, Inv_Producto_Sub_Categoria.Parametro1 from Inv_Producto_Sub_Categoria inner Join Inv_Producto on Inv_Producto.Id_Producto = Inv_Producto_Sub_Categoria.Id_Producto inner Join Inv_Sub_Categoria on Inv_Sub_Categoria.Id_Sub_Categoria = Inv_Producto_Sub_Categoria.Id_Sub_Categoria where Inv_Producto_Sub_Categoria.Id_Empresa = 7 and Inv_Producto_Sub_Categoria.Estado = 1 and Inv_Producto_Sub_Categoria.Id_Producto = " + Product + " Order by Inv_Producto_Sub_Categoria.Porcentaje";
    //let sql = "select Inv_Producto_Sub_Categoria.Id_Sub_Categoria,Inv_Sub_Categoria.Nombre, ((Inv_Producto.Precio * Inv_Producto_Sub_Categoria.Porcentaje) /100) Precio,Inv_Producto_Sub_Categoria.Parametro1 , case when  Inv_Producto_Empresa.Id_Producto_Empresa is not null then 'selected' else  '' end as Selected from Inv_Producto_Sub_Categoria inner Join Inv_Producto on Inv_Producto.Id_Producto = Inv_Producto_Sub_Categoria.Id_Producto inner Join Inv_Sub_Categoria on Inv_Sub_Categoria.Id_Sub_Categoria = Inv_Producto_Sub_Categoria.Id_Sub_Categoria left join Inv_Producto_Empresa on Inv_Producto_Sub_Categoria.Id_Producto = Inv_Producto_Empresa.Id_Producto and Inv_Producto_Sub_Categoria.Id_Empresa = Inv_Producto_Empresa.Id_Empresa and Inv_Producto_Sub_Categoria.Id_Sub_Categoria = Inv_Producto_Empresa.Id_Sub_Categoria where Inv_Producto_Sub_Categoria.Id_Empresa = 7 and Inv_Producto_Sub_Categoria.Estado = 1 and Inv_Producto_Sub_Categoria.Id_Producto = " + Product + " Order by Inv_Producto_Sub_Categoria.Porcentaje";
    let sql = " select Inv_Producto_Sub_Categoria.Id_Sub_Categoria,((Inv_Producto.Precio * Inv_Producto_Sub_Categoria.Porcentaje) /100) Precio,'' as Selected, Inv_Sub_Categoria.Nombre,Inv_Producto_Sub_Categoria.Porcentaje,Inv_Producto_Sub_Categoria.Parametro1 From Inv_Producto_Sub_Categoria inner join Inv_Sub_Categoria on Inv_Producto_Sub_Categoria.Id_Sub_Categoria = Inv_Sub_Categoria.Id_Sub_Categoria inner join Inv_Producto on Inv_Producto_Sub_Categoria.id_Producto = Inv_Producto.Id_Producto where Inv_Producto_Sub_Categoria.Id_Empresa =7 and Inv_Producto_Sub_Categoria.Estado =1 and Inv_Producto_Sub_Categoria.id_Producto = " + Product + " Order by Inv_Producto_Sub_Categoria.Porcentaje ";
    let data = await this.apiService.postRecord(sql);
    return data;
  }
  async getSubCategofyForProdictAndCia(Product:any){
    let cia = localStorage.getItem("Id_Empresa");
    let sql = "select Id_Sub_Categoria from Inv_Producto_Empresa where Id_Empresa = "+cia+ " and Id_Producto  = " + Product;
    let data = await this.apiService.postRecord(sql);
    return data;
  }
  async getTrigger(record){
    let sql = "select Nombre from Gen_Trigger where Estado = 1 and  Id_Empresa = 7 and Sistema_Origen = 'INV' and Objeto='Inv_Producto' and Registro_Origen="+ record
    let data = await this.apiService.postRecord(sql);
    return data;
  }
  async execSotreProcedure(StoreProcedure,Id_Product,Id_Empresa?,Id_Usuario?){
    let empresaId = '';
    let usarioId = '';
    if(Id_Empresa){
      empresaId = Id_Empresa;
    }else{
      empresaId = localStorage.getItem("Id_Empresa");
    }
    if(Id_Usuario){
      usarioId = Id_Usuario;
    }else{
      usarioId = localStorage.getItem('Id_Usuario');//+ ","+Id_Product;
    }
    let sql = "EXECUTE " + StoreProcedure + " " + empresaId + "," + usarioId + "," + Id_Product;
    let data = await this.apiService.postRecord(sql);
    return true;
  }
  async loadFile(file){
    return await this.apiService.loadFile(file);
  }
}
