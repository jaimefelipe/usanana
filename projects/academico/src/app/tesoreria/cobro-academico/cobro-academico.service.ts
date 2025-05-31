import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CobroAcademicoService {

  constructor(private apiService: ApiService) {}
  async loadCostos(paginacion,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Edu_Cobros',
      fields: 'Id_Cobro,Id_Producto,Nombre,Nivel,Unico,Credito_Universitario,Estado,Creado_El,Creado_Por',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async leerCobro(Id_Cobro){
    let sqlConfig = {
      table: 'Edu_Cobros',
      fields: 'Id_Cobro,Id_Producto,Nombre,Unico,Credito_Universitario,Estado,Nivel',
      where: 'Id_Cobro =' + Id_Cobro
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async LeerNombreProducto(Id_Producto){
    let sqlConfig = {
      table: 'Inv_Producto',
      fields: 'Descripcion',
      where: 'Id_Producto = ' + Id_Producto
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async NuevoCobro(Cobro){
    let sql = {
      table: 'Edu_Cobros',
      fields: 'Id_Producto,Nombre,Unico,Credito_Universitario,Estado,Nivel',
      values: '\'' + Cobro.Id_Producto 
      + '\',\'' + Cobro.Nombre 
      +  '\',\'' +  Cobro.Unico 
      + '\',\'' + Cobro.Credito_Universitario 
      + '\',\'' + Cobro.Estado 
      + '\',\'' + Cobro.Nivel 
      + '\''

    };
    return await this.apiService.insertRecord(sql);
  }
  async ActualizarCobro(Cobro){
    let sql = {
       table: 'Edu_Cobros',
        fields: 'Id_Producto=\'' + Cobro.Id_Producto 
        + '\',Nombre=\'' + Cobro.Nombre 
        + '\',Unico=\'' + Cobro.Unico 
        + '\',Credito_Universitario=\'' + Cobro.Credito_Universitario 
        + '\',Nivel=\'' + Cobro.Nivel 
        + '\',Estado=\'' + Cobro.Estado + '\'',
        where: 'Id_Cobro=' + Cobro.Id_Cobro
    };
    return await this.apiService.updateRecord(sql);
  }
}
