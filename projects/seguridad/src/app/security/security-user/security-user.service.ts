import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityUserService {

  constructor(private apiService: ApiService) {}
  async loadAllUsers(paginacion,search?) {
    let sqlConfig = {
      table: 'Seg_Usuario',
      fields: 'Id_Usuario,Nombre,Nombre_Usuario',
      orderField: '',
      searchField: search,
      simple:true,
      Empresa: false,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadUsers(paginacion,search?) {
    let Master = localStorage.getItem("ToxoMT");
    let where = '';
    if(Master != '1'){
      where = ' Seg_Usuario_Empresa.Id_Empresa =' + localStorage.getItem('Id_Empresa')
    }
    let sqlConfig = {
      table: 'Seg_Usuario Inner Join Seg_Usuario_Empresa On Seg_Usuario.Id_Usuario = Seg_Usuario_Empresa.Id_Usuario',
      fields: 'Seg_Usuario.Id_Usuario,Nombre,Nombre_Usuario,Seg_Usuario.Estado,Tipo_Usuario',
      orderField: '',
      searchField: search,
      Empresa: false,
      where: where,
      GroupBy: ' Group By Seg_Usuario.Id_Usuario,Seg_Usuario.Nombre,Seg_Usuario.Nombre_Usuario,Seg_Usuario.Estado,Seg_Usuario.Tipo_Usuario ',
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadUser(Id_Usuario){
    let Master = localStorage.getItem("ToxoMT");
    let campos = 'Id_Usuario,Nombre,Correo,Nombre_Usuario,Seg_Usuario.Estado,Tipo_Usuario,Ventas,Compras,Inventario,CXC,CXP,CG,BA,Restaurante,Transporte,Seguridad,Hospedaje,Turismo,Salonero,Academico,Pov,Numero_Identificacion'
    if(Master == '1'){
      campos = campos + ',Clave';
    }
    let sqlConfig = {
      table: 'Seg_Usuario',
      fields: campos,
      orderField: '',
      searchField: '',
      Empresa: false,
      where: "Id_Usuario = " + Id_Usuario
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async updateUser(Usuario){
    let sql = {
      table: 'Seg_Usuario',
      fields: 'Nombre=\'' + Usuario.Nombre
      + '\',Correo=\'' + Usuario.Correo
      + '\',Clave=\'' + Usuario.Clave
      + '\',Salonero=\'' + Usuario.Salonero
      + '\',Tipo_Usuario=\'' + Usuario.Tipo_Usuario
      + '\',Ventas=\''+ Usuario.Ventas
      + '\',Compras=\''+ Usuario.Compras
      + '\',Inventario=\''+ Usuario.Inventario
      + '\',CXC=\''+ Usuario.CXC
      + '\',CXP=\''+ Usuario.CXP
      + '\',CG=\''+ Usuario.CG
      + '\',BA=\''+ Usuario.BA
      + '\',Restaurante=\''+ Usuario.Restaurante
      + '\',Transporte=\''+ Usuario.Transporte
      + '\',Seguridad=\''+ Usuario.Seguridad
      + '\',Hospedaje=\''+ Usuario.Hospedaje
      + '\',Turismo=\''+ Usuario.Turismo
      + '\',Academico=\''+ Usuario.Academico
      + '\',Estado=\''+ Usuario.Estado
      + '\',Pov=\''+ Usuario.Pov
      + '\',Numero_Identificacion=\''+ Usuario.Numero_Identificacion
      + '\'',
      where: 'Id_Usuario=' + Usuario.Id_Usuario
    };
    let dat = await this.ValidarPersonaExiste(Usuario.Numero_Identificacion);
    if(dat['total'] == 0){
      //insertar la persona;
      await this.CrearPersonaBasdaUsuario(Usuario.Numero_Identificacion,Usuario.Nombre);
    }
    return await this.apiService.updateRecord(sql);
  }
  async inserUsert(Usuario){
    let userName = await this.composeUsername(Usuario.Nombre)
    let Clave = 'Password';
    let sql = {
      table: 'Seg_Usuario',
      fields: 'Nombre,Nombre_Usuario,Correo,Clave,Tipo_Usuario,Estado,Ventas,Compras,Inventario,CXC,CXP,CG,BA,Restaurante,Transporte,Seguridad,Hospedaje,Turismo,Academico,Pov,Numero_Identificacion',
      Empresa: false,
      values: '\'' + Usuario.Nombre
      + '\',\'' + userName
      + '\',\'' + Usuario.Correo
      + '\',\'' + Clave
      + '\',\'' + Usuario.Tipo_Usuario
      + '\',\'' + 1
      + '\',\'' + Usuario.Ventas
      + '\',\'' + Usuario.Compras
      + '\',\'' + Usuario.Inventario
      + '\',\'' + Usuario.CXC
      + '\',\'' + Usuario.CXP
      + '\',\'' + Usuario.CG
      + '\',\'' + Usuario.BA
      + '\',\'' + Usuario.Restaurante
      + '\',\'' + Usuario.Transporte
      + '\',\'' + Usuario.Seguridad
      + '\',\'' + Usuario.Hospedaje
      + '\',\'' + Usuario.Turismo
      + '\',\'' + Usuario.Academico
      + '\',\'' + Usuario.Pov
      + '\',\'' + Usuario.Numero_Identificacion
      + '\''
    };
    let dat = await this.ValidarPersonaExiste(Usuario.Numero_Identificacion);
    if(dat['total'] == 0){
      //insertar la persona;
      await this.CrearPersonaBasdaUsuario(Usuario.Numero_Identificacion,Usuario.Nombre);
    }
    return await this.apiService.insertRecord(sql);
  }
  async composeUsername(Name){
    let arrUserName = Name.split(' ');
    let userName = arrUserName[0] + "." + arrUserName[1];
    userName = userName.toLowerCase();
    let valido = false;
    let data = [];
    let contador = 0;
    let UserNameCompound = userName;
    while (!valido){
       //Validar si el usuario existe
      let sql = "Select Id_Usuario from Seg_Usuario where Nombre_Usuario= '" + UserNameCompound +"'";
      let add ="";
      data = await this.apiService.postRecord(sql);
      if(data['total']==1){
        contador++;
        add = "";
        if(contador < 10){
          add="0"+contador;
        }else{
          add = contador.toString();
        }
        UserNameCompound = userName + add;
      }else{
        valido = true;
      }
    }
    if(UserNameCompound != ""){
      userName = UserNameCompound;
    }
    return userName;
  }
  async AsociarUsuario(Id_Usuario,Id_Empresa){
    let sql = {
      table: 'Seg_Usuario_Empresa',
      fields: 'Id_Empresa,Id_Usuario,Estado',
      Empresa: false,
      values: '\'' + Id_Empresa
      + '\',\'' + Id_Usuario + '\',1'
    };
    return await this.apiService.insertRecord(sql);
  }
  async validateUser(UserName){
    let sql = "Select Id_Usuario from Seg_Usuario where Correo= '" + UserName +"'";
    return await this.apiService.postRecord(sql);
  }
  async ChangeUserStatus(Id_User,Id_Empresa,Status){
    let sql = "Update Seg_Usuario_Empresa set Estado = " + Status + " where Id_Usuario = " + Id_User + " and Id_Empresa = " + Id_Empresa;
    return await this.apiService.postRecord(sql);
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

}
