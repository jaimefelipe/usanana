import { ApiService } from '../../../../../core/src/app/lib/api.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LicenciaService {

  constructor(private apiService: ApiService) {}
  async getLicencias(paginacion?,search?){
    //let sql= "select Gen_Empresa.Id_Empresa,Gen_Empresa.Nombre as Empresa, Gen_Empresa.Estado,Inv_Producto_Empresa.Id_Producto,Inv_Producto.Descripcion,Inv_Producto.Precio,Inv_Producto.Moneda,Inv_Producto_Empresa.Id_Sub_Categoria, Inv_Sub_Categoria.Nombre, Inv_Producto_Empresa.Estado,Inv_Producto_Empresa.Fecha_Vencimiento,Cantidad_Disponible From Gen_Empresa left join Inv_Producto_Empresa on Gen_Empresa.Id_Empresa = Inv_Producto_Empresa.Id_Empresa left join Inv_Producto on Inv_Producto_Empresa.Id_Producto = Inv_Producto.Id_Producto left join Inv_Sub_Categoria on Inv_Producto_Empresa.Id_Sub_Categoria = Inv_Sub_Categoria.Id_Sub_Categoria";
    //return await this.apiService.postRecord(sql);

    let sqlConfig = {
      //table: 'Gen_Empresa left join Inv_Producto_Empresa on Gen_Empresa.Id_Empresa = Inv_Producto_Empresa.Id_Empresa left join Inv_Producto on Inv_Producto_Empresa.Id_Producto = Inv_Producto.Id_Producto left join Inv_Sub_Categoria on Inv_Producto_Empresa.Id_Sub_Categoria = Inv_Sub_Categoria.Id_Sub_Categoria',
      //fields: 'Inv_Producto_Empresa.Id_Producto_Empresa, Gen_Empresa.Id_Empresa,Gen_Empresa.Nombre as Empresa, Gen_Empresa.Estado as Empresa_Estado,Inv_Producto_Empresa.Id_Producto,Inv_Producto.Descripcion,Inv_Producto.Precio,Inv_Producto.Moneda,Inv_Producto_Empresa.Id_Sub_Categoria, Inv_Sub_Categoria.Nombre, Inv_Producto_Empresa.Estado as Producto_Estado,Inv_Producto_Empresa.Fecha_Vencimiento,Cantidad_Disponible',
      table:'Gen_Empresa left join Inv_Producto_Empresa on Gen_Empresa.Id_Empresa = Inv_Producto_Empresa.Id_Empresa  left join Inv_Producto on Inv_Producto_Empresa.Id_Producto = Inv_Producto.Id_Producto  left join Inv_Categoria on Inv_Producto_Empresa.Id_Sub_Categoria = Inv_Categoria.Id_Categoria',
      fields:'Inv_Producto_Empresa.Id_Producto_Empresa, Gen_Empresa.Id_Empresa,Gen_Empresa.Nombre as Empresa, Gen_Empresa.Estado as Empresa_Estado,Inv_Producto_Empresa.Id_Producto,Inv_Producto.Descripcion,Inv_Producto.Precio,Inv_Producto.Moneda,Inv_Producto_Empresa.Id_Sub_Categoria, Inv_Categoria.Nombre, Inv_Producto_Empresa.Estado as Producto_Estado,Inv_Producto_Empresa.Fecha_Vencimiento,Cantidad_Disponible',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      Empresa:false
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async getLicenciaCia(Id_Empresa){
    let sqlConfig = {
      table: 'Inv_Producto_Empresa',
      fields: 'Id_Producto_Empresa',
      where:'Id_Empresa =' + Id_Empresa,
      Empresa:false
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async NuevaLicenciaCia(Licencia){
    let sql = {
      table: 'Inv_Producto_Empresa',
      fields: 'Id_Empresa,Id_Producto,Estado,Fecha_Vencimiento,Cantidad_Disponible',
      Empresa:false,
      values: '\'' + Licencia.Id_Empresa
      + '\',\'' + Licencia.Id_Producto
      + '\',\'' + Licencia.Empresa_Estado
      + '\',\'' + Licencia.Fecha_Vencimiento
      + '\',\'' + Licencia.Cantidad_Disponible
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateLicencia(licencia){
    let sql = "Update Inv_Producto_Empresa Set Fecha_Vencimiento = '"+ licencia.Fecha_Vencimiento+"', Cantidad_Disponible = '"+licencia.Cantidad_Disponible+"', Estado = '"+licencia.Empresa_Estado+"' where Id_Producto_Empresa = '"+licencia.Id_Producto_Empresa +"'";
    return await this.apiService.postRecord(sql);
  }
  async updateLicenciaCia(licencia){
    let sql = "Update Inv_Producto_Empresa Set Fecha_Vencimiento = '"+ licencia.Fecha_Vencimiento+"', Cantidad_Disponible = '"+licencia.Cantidad_Disponible+"', Estado = '"+licencia.Empresa_Estado+"' where Id_Empresa = '"+licencia.Id_Empresa +"'";
    return await this.apiService.postRecord(sql);
  }
}
