import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from '../login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-campus',
  templateUrl: './login-campus.component.html',
  styleUrls: ['./login-campus.component.css']
})
export class LoginCampusComponent implements OnInit {

  constructor(
     private router: Router,
    private loginService:LoginService,
  ) { }

  ngOnInit() {
  }
  registro = {
    email:'',
    password:'',
    empresa:'0'
  }
  email = '';
  password = '';

  ingresar() {
    // Aquí podés hacer la llamada a tu servicio de autenticación
    console.log('Ingresar con', this.email, this.password);
  }

  async onLoggedin() {
      if(this.registro.empresa == ""){
        await this.emailValidation();
      }
      let data = await this.loginService.authenticateUser(this.registro);
      if(!data){
        Swal.fire('No se logro autenticar el usuario');
        return false;
      }else{
        localStorage.setItem('isLoggedin', 'true');
        //Cargar los parametros por compania
        if(this.registro.password == 'password'){
          this.router.navigate(['/cambiar']);
        }else{
          let arrlocation = window.location.pathname.split('/');
          if (arrlocation.length == 2){
            window.location.href = "/"
          }else{
            window.location.href = "/"+arrlocation[1]+'/';
          }
        }
      };
      return true;
    }

    async emailValidation(){
        if(this.registro.email == "")
         return false;
        let data =  await this.loginService.getUserCompany(this.registro.email);
        if(data['total'] == 0){
          Swal.fire('El Usuario no existe en el sistema');
          return false;
        }
        if(data['total'] > 1){
          this.registro.empresa = data['data'][0]['Id_Empresa'];
        }else{
          this.registro.empresa = data['data'][0]['Id_Empresa']
        }
        return true;
      }
}
