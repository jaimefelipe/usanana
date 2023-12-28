import { ChangeService } from './change.service';
import { SignupService } from '../signup/signup.service';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css']
})
export class ChangeComponent implements OnInit {

  constructor(private signupService:SignupService,
    private router: Router,
    private changeService:ChangeService
    ) { }
  registro = {
    nombre: '',
    correo:'',
    clave0:'',
    clave1:'',
    clave2:'',
    terminos:false,
  }
  pass = {
    strength : '',
    color :'none',
    peso:0
  }
  ngOnInit(): void {
  }

  stronKeyValidation(e:any){
    this.pass = this.signupService.strongPassword(this.registro.clave1);
  }
  async cambiar(){
    //Validar si la clave actual es la correcta.
    let valido = await this.changeService.validatePassword(this.registro.clave0);
    if(!valido){
      Swal.fire("La clave original no coincide con la registrada en el sistema");
      return false;
    }
    if(this.registro.clave1 != this.registro.clave2){
      Swal.fire("La clave Nueva no Coincide con la Verificación");
      return false;
    }
    if(this.pass.peso < 4){
      Swal.fire('La contraseña debe ser fuerte');
      return false;
    }
    let data = await this.changeService.cambiarClave(this.registro.clave1);
    Swal.fire('La contraseña cambiada correctamente');
    return true;
  }

}
