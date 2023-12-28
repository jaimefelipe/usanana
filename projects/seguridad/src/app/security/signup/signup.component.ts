import { Component, OnInit } from '@angular/core';
import { SignupService } from './signup.service';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private signupService:SignupService,private router: Router) { }
  registro = {
    nombre: '',
    correo:'',
    clave1:'',
    clave2:'',
    terminos:false,
  }
  regActive = true;
  pass = {
    strength : '',
    color :'none',
    peso:0
  }
  ngOnInit(): void {
  }
  async registrarse(){
    if(!this.regActive){
      return false;
    }
    this.regActive = false;
    //validar si el nombre tiene caracteres extraños
    let valid = await this.validateForm()
    if (valid){
      if(await this.validateIfUserExist() == false) this.regActive = true;
    }else{
      this.regActive = true;
    };
    return true;
  }
  async validateIfUserExist(){
    let user = await this.signupService.userExist(this.registro);
    if(user['total']>0){
      Swal.fire('Ya existe un usuario registrado con este correo');
      return false;
    }
    return await this.createUser()
  }
  async createUser(){
    let user = await this.signupService.createUser(this.registro);
    if(user){
      Swal.fire('Usuario ' + this.registro.correo + ' Creado Correctamente');
      this.router.navigate(['/login']);
    }
  }
  validateForm(){
    let largoNombre = this.registro.nombre.length;
    for(let i = 0; i < largoNombre; i++){
      let letra = this.registro.nombre[i];
      if( !(letra.match(/^[a-z]+$/) || letra.match(/^[A-Z]+$/) || letra.match(/^[á,é,í,ó,ú,ñ, ]+$/)) ) {
        Swal.fire('El nombre contiene caracter ' + letra  +' que es invalido');
        return false;
      }
    }
    if(this.registro.nombre.match(/^[a-z]+/))
    if (this.registro.nombre.split(" ").length == 1){
      Swal.fire('Debe suministrar su Nombre Completo');
      return false;
    }
    if(this.registro.clave2 == "" || this.registro.correo == "" || this.registro.clave1 == "") {
      Swal.fire('Alguno de los campos requeridos no tiene infomación');
      return false;
    }
    let exp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/g;
    if(!this.registro.correo.match(exp)){
        Swal.fire('El correo suministrado es invalido');
        return false;
    }

    if(this.registro.clave1 != this.registro.clave2){
      Swal.fire('Las Claves no concuerdan, reviselas');
      return false;
    }
    if(this.registro.terminos != true){
      Swal.fire('Debe aceptar los terminos para poder registrarse');
      return false;
    }
    if(this.pass.peso < 4){
      Swal.fire('La contraseña debe ser fuerte');
      return false;
    }
    return true;
  }
  stronKeyValidation(e:any){
    this.pass = this.signupService.strongPassword(this.registro.clave1);
  }

}
