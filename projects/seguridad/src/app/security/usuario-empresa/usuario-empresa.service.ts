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
      fields: 'Id_Usuario_Empresa,Seg_Usuario_Empresa.Id_Empresa,Seg_Usuario_Empresa.Id_Usuario,Seg_Usuario_Empresa.Estado, Gen_Empresa.Nombre as Nombre_Empresa, Seg_Usuario.Nombre as Nombre_Usuario, Seg_Usuario.Correo,Seg_Usuario.Numero_Identificacion',
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
    let dat = await this.ValidarPersonaExiste(UsuarioEmpresa.Numero_Identificacion);
    if(dat['total'] == 0){
      //insertar la persona;
      await this.CrearPersonaBasdaUsuario(UsuarioEmpresa.Numero_Identificacion,UsuarioEmpresa.Nombre);
    }
    let data = await this.apiService.updateRecord(sql);
    await this.asociarUsuarioEmpresa( UsuarioEmpresa.Id_Usuario, UsuarioEmpresa.Id_Empresa); 
    return data 
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
    let dat = await this.ValidarPersonaExiste(UsuarioEmpresa.Numero_Identificacion);
    if(dat['total'] == 0){
      //insertar la persona;
      await this.CrearPersonaBasdaUsuario(UsuarioEmpresa.Numero_Identificacion,UsuarioEmpresa.Nombre);
    }
    let data = await this.apiService.insertRecord(sql);
    await this.asociarUsuarioEmpresa( UsuarioEmpresa.Id_Usuario, UsuarioEmpresa.Id_Empresa);
    return data
  }

  async cargarEmpresaDeUnUsuario(Id_Usuario) {
    let sqlConfig = {
      table: 'Seg_Usuario_Empresa',
      fields: 'Id_Empresa',
      Empresa: false,
      where: 'Id_Usuario =' + Id_Usuario
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  //Agregar Persona si no existe a la compania actual
  //1 validar si persona existe
  async ValidarPersonaExiste(Numero_Identificacion){
    let sql = "Select Id_Persona from Gen_Persona where Identificacion = '" + Numero_Identificacion +"' and Id_Empresa = "+ localStorage.getItem('Id_Empresa');
    return await this.apiService.postRecord(sql);
  }
  async CrearPersonaBasdaUsuario(Identificacion,Nombre){
    let sql = {
      table: 'Gen_Persona',
      fields: 'Identificacion,Nombre,Estado',
      values: '\'' + Identificacion
      + '\',\'' + Nombre + '\',1'
    };
    return await this.apiService.insertRecord(sql);
  }

  async asociarUsuarioEmpresa(Id_Usuario,Id_Empresa){
    let data = await this.apiService.postRecord("Call sp_Seg_Asociar_Usuario_Empresas("+ Id_Usuario + ',' + Id_Empresa+ ","+ localStorage.getItem('Id_Usuario') +  ")" );
  }
}
