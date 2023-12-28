import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class ProductoClienteService {

constructor(private apiService:ApiService) { }

  async loadClients(paginacion,search?){
    let sqlConfig = {
      table: 'Gen_Persona inner Join Ven_Persona_Producto on Gen_Persona.Id_Persona = Ven_Persona_Producto.Id_Persona',
      fields: 'Gen_Persona.Id_Persona, Nombre, Telefono,Correo, Gen_Persona.Estado,Otro_Documento,Identificacion',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      orderDirection:' DESC '
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadProducts(Id_Persona){
    let sqlConfig = {
      table: 'Ven_Persona_Producto inner join Gen_Persona on Ven_Persona_Producto.Id_Persona = Gen_Persona.Id_Persona inner join Inv_Producto on Ven_Persona_Producto.Id_Producto = Inv_Producto.Id_Producto',
      fields: 'Id_Persona_Producto,Ven_Persona_Producto.Id_Persona,Ven_Persona_Producto.Id_Producto,Ven_Persona_Producto.Estado,Nombre as Nombre_Persona, Descripcion as Nombre_Producto',
      orderField: '',
      searchField: '',
      where: 'Ven_Persona_Producto.Id_Persona = ' + Id_Persona
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async insertPersonaProducto(Persona){
    let sql = {
      table: 'Ven_Persona_Producto',
      fields: 'Id_Persona,Id_Producto,Estado',
      values: '\'' + Persona.Id_Persona
      + '\',\'' + Persona.Id_Producto
      + '\',\'' + Persona.Estado
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updatePersonaProducto(Persona){
    let sql = {
      table: 'Ven_Persona_Producto',
      fields: 'Id_Persona=\'' + Persona.Id_Persona
      + '\',Id_Producto=\'' + Persona.Id_Producto
      + '\',Estado=\'' + Persona.Estado
      + '\'',
      where: 'Id_Persona=' + Persona.Id_Persona
    };
    return await this.apiService.updateRecord(sql);
  }

}
