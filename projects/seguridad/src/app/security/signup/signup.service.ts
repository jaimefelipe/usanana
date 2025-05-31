import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private apiService:ApiService) { }
  Id_Empresa:any;
  Id_Sucursal:any;
  Id_Caja:any;
  Id_Usuario:any;
  getId_Empresa(){
    return this.Id_Empresa;
  }
  getId_User(){
    return this.Id_Usuario;
  }
  strongPassword(password:string){
    //Regular Expressions.
    var regex = new Array();
    regex.push("[A-Z]"); //Uppercase Alphabet.
    regex.push("[a-z]"); //Lowercase Alphabet.
    regex.push("[0-9]"); //Digit.
    regex.push("[$@$!%*#?&]"); //Special Character.
    var passed = 0;
    //Validate for each Regular Expression.
    for (var i = 0; i < regex.length; i++) {
      if (new RegExp(regex[i]).test(password)) {
          passed++;
      }
    }
    //Validate for length of Password.
    if (passed > 2 && password.length > 8) {
        passed++;
    }
    if (passed > 5 && password.length > 10){
       passed++;
    }

    //Display status.
    var color = "";
    var strength = {
      strength : '',
      color :'',
      peso:0
    };
    switch (passed) {
      case 0:
      case 1:
        strength.strength = "Contraseña Debil ";
        strength.color = "cred";
        break;
      case 2:
        strength.strength = "Contraseña Regular ";
        strength.color = "cdarkorange";
        break;
      case 3:
      case 4:
      case 5:
        strength.strength = "Contraseña Fuerte ";
        strength.color = "cgreen";
        break;

      case 6:
        strength.strength = "Contraseña Muy Fuerte ";
        strength.color = "cdarkgreen";
        break;
    }
    strength.peso = passed
    if(password == ""){
      strength.strength = "";
      strength.color = "none";
      strength.peso = 0;
    }
    return strength
  }
  async userExist(user:any){
    let data:any;
    let sql = "Select Id_Usuario, Estado From Seg_Usuario where correo = '" + user.correo + "'";
    data = await this.apiService.postRecord(sql);
    return data;
  }
  async crearEmpresa(user){
    if(!this.Id_Empresa){
      this.Id_Empresa = localStorage.getItem("Id_Empresa");
    }
    //Generar Empresa
    //Verificar si la Empresa existe
    let sql = "SELECT Id_Empresa from Gen_Empresa Where Nombre = '" + user.nombre + "' and Correo = '"+ user.correo +"'";
    let empresaExiste = await this.apiService.postRecord(sql);
    if(empresaExiste['total']==0){
      let sqlEmpresa = {
        table:'Gen_Empresa',
        fields: 'Nombre,Razon_Social,Correo,Estado',
        values: "'" + user.nombre + "','" + user.nombre + "','" + user.correo + "',1",
        Empresa:false
      }
      let empresa = await this.apiService.insertRecord(sqlEmpresa);
      
      if(empresa['total']==1){
        this.Id_Empresa = empresa['Identity'];
        localStorage.setItem("Id_Empresa",this.Id_Empresa)
      }else{
        alert('Problema generando Empresa');
        return false
      }
      return true;
    }else{
      this.Id_Empresa = empresaExiste['data'][0]['Id_Empresa'];
      localStorage.setItem("Id_Empresa",this.Id_Empresa)
    }
    return true;
  }
  async crearSucursal(){
    if(!this.Id_Empresa){
      this.Id_Empresa = localStorage.getItem("Id_Empresa");
    }
    //Validar si Existe la Sucursal
    let sql = "SELECT Id_Sucursal from Gen_Sucursal Where Id_Empresa = " + this.Id_Empresa;
    let empresaSucursal = await this.apiService.postRecord(sql);
    if(empresaSucursal['total'] == 0){
      //Generar Sucursal
      let sqlSucursal  = {
        table:'Gen_Sucursal',
        fields: 'Id_Empresa,Numero_Sucursal,Nombre,Estado',
        values: this.Id_Empresa + ",'001','Oficina Principal',1",
        Empresa:false
      }
      let sucursal = await this.apiService.insertRecord(sqlSucursal);
      this.Id_Sucursal = sucursal['Identity'];
      return sucursal;
    }else{
      return empresaSucursal;
    }
  }
  async crearCaja(){
    if(!this.Id_Empresa){
      this.Id_Empresa = localStorage.getItem("Id_Empresa");
    }
    if(!this.Id_Sucursal){
      let sql = "SELECT Id_Sucursal from Gen_Sucursal Where Id_Empresa = " + this.Id_Empresa;
      let empresaSucursal = await this.apiService.postRecord(sql);
      this.Id_Sucursal = empresaSucursal['Id_Sucursal'];
    }
    //Generar Caja
    let sql = "SELECT Id_Caja from Ven_Caja Where Id_Empresa = " + this.Id_Empresa;
    let cajaExiste = await this.apiService.postRecord(sql);
    if(cajaExiste['total'] == 0){
      let sqlCaja = {
        table:'Ven_Caja',
        fields: 'Id_Empresa,Id_Sucursal,Numero_Caja,Consecutivo,Estado',
        values: this.Id_Empresa + ",'" + this.Id_Sucursal + "','00001',1,1",
        Empresa:false
      }
      let sucursal = await this.apiService.insertRecord(sqlCaja);
      if(sucursal['total']==1){
        this.Id_Sucursal = sucursal['Identity'];
        return sucursal;
      }else{
        alert('Problema generando Empresa');
        return false
      }
    }
    return cajaExiste;
  }

  async crearUsuario(userName,user){
    //Insertar el registro en User
    let sqlConf = {
      table:'Seg_Usuario',
      fields: 'Nombre_Usuario,Clave,Nombre,Correo,Estado',
      values: "'" + userName + "','" + user.clave1 + "','" + user.nombre + "','" + user.correo + "',1",
      Empresa:false
    }
    let data = await this.apiService.insertRecord(sqlConf);   
    let Id_Usuario = data['Identity'];
    this.Id_Usuario = Id_Usuario
    //Asociar Usuario a Compañia
    let sqlUsuarioCia = {
      table:'Seg_Usuario_Empresa',
      fields: 'Id_Usuario,Id_Empresa,Estado',
      values: "'" + this.Id_Usuario + "','" + this.Id_Empresa + "',1",
      Empresa:false
    }
    let UsuarioEmpresa = await this.apiService.insertRecord(sqlUsuarioCia);
    return this.Id_Usuario;
  }
  async createUser(user:any){
    // Registro de un usuario Simple del sistema asociado a una compañia de tipo Personal.
    // Hay que crear el usuario, la compaña, asociar el usuario a la compañia
    // Cada sub sistema que realice el registro debe asociar el usuario a este subsistema

    // Generar nombre de usuario, considerando que pueden haber varias personas que se llamen igual por lo que hay que generar un numero adicional
    // hay que validar si ya exite el usuaro.
    let arrUserName = user.nombre.split(' ');
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
    let status = true;
    status = await this.crearEmpresa(user);
    if(status){
      status = await this.crearSucursal();
    }
    if(status){
      let status = await this.crearCaja();
    }
    if(status){
      let status = await this.crearUsuario(userName,user);
    }
    return status;
  }
}
