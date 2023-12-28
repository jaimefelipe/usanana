import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEmpresaService {

constructor(
  private apiService:ApiService
) { }

  async cargarUsuariosEmpresa(paginacion,search?) {
    let sqlConfig = {
      table: 'Seg_Usuario_Empresa inner Join Seg_Usuario on Seg_Usuario_Empresa.Id_Usuario = Seg_Usuario.Id_Usuario inner join Gen_Empresa on Seg_Usuario_Empresa.Id_Empresa = Gen_Empresa.Id_Empresa',
      fields: 'Id_Usuario_Empresa,Seg_Usuario_Empresa.Id_Empresa,Seg_Usuario_Empresa.Id_Usuario,Seg_Usuario_Empresa.Estado, Gen_Empresa.Nombre as Nombre_Empresa, Seg_Usuario.Nombre as Nombre_Usuario, Seg_Usuario.Correo',
      orderField: '',
      searchField: search,
      Empresa: false
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async cargarUsuarioEmpresa(Id_Usuario_Empresa){
    let sqlConfig = {
      table: 'Seg_Usuario_Empresa inner Join Seg_Usuario on Seg_Usuario_Empresa.Id_Usuario = Seg_Usuario.Id_Usuario inner join Gen_Empresa on Seg_Usuario_Empresa.Id_Empresa = Gen_Empresa.Id_Empresa',
      fields: 'Id_Usuario_Empresa,Seg_Usuario_Empresa.Id_Empresa,Seg_Usuario_Empresa.Id_Usuario,Seg_Usuario_Empresa.Estado, Gen_Empresa.Nombre as Nombre_Empresa, Seg_Usuario.Nombre as Nombre_Usuario, Seg_Usuario.Correo',
      where: 'Seg_Usuario_Empresa.Id_Usuario_Empresa = '+Id_Usuario_Empresa,
      Empresa: false
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async updateUser(UsuarioEmpresa){
    let sql = {
      table: 'Seg_Usuario_Empresa',
      fields: 'Id_Usuario=\'' + UsuarioEmpresa.Id_Usuario
      + '\',Id_Empresa=\'' + UsuarioEmpresa.Id_Empresa
      + '\',Estado=\'' + UsuarioEmpresa.Estado
      + '\'',
      where: 'Id_Usuario_Empresa=' + UsuarioEmpresa.Id_Usuario_Empresa
    };
    return await this.apiService.updateRecord(sql);
  }
  async inserUsert(UsuarioEmpresa){
    let sql = {
      table: 'Seg_Usuario_Empresa',
      fields: 'Id_Usuario,Id_Empresa,Estado',
      Empresa: false,
      values: '\'' + UsuarioEmpresa.Id_Usuario
      + '\',\'' + UsuarioEmpresa.Id_Empresa
      + '\',\'' + UsuarioEmpresa.Estado
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
}
