import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { ParametrosCiaService } from '../../../../../main/src/app/general/parametros-cia/parametros-cia.service';


import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private loginService:LoginService,
    private parametrosCiaService:ParametrosCiaService
    ) {}
  registro = {
    email:'',
    password:'',
    empresa:'0'
  }
  multiCompany =  false;
  companies = [];
  ngOnInit(): void {}

  ngAfterViewInit() {
    $(function() {
      $(".preloader").fadeOut();
    });
    /*
    $(function() {
        (<any>$('[data-toggle="tooltip"]')).tooltip()
    });
    */
    $('#to-recover').on("click", function() {
        $("#loginform").slideUp();
        $("#recoverform").fadeIn();
    });
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
      this.LoadInterfazInventario();
      this.LoadInterfazContable();
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

    //localStorage.setItem('isLoggedin', 'true');
    //this.router.navigate(['/']);
    //window.location.href = "/";
  }
  async LoadInterfazInventario(){
    let data = await this.parametrosCiaService.loadParameterCia(localStorage.getItem('Id_Empresa'),'Inv_Interfaz_Inventario');
    if(data['total'] > 0){
      localStorage.setItem('TIC',data['data'][0]['Valor']);
      if(data['data'][0]['Valor'] == 1){
        this.LoadTiqueteCaja();
        this.LoadIvaIncluido();
      }
    }else{
      localStorage.setItem('TIC','0');
    }
  }
  async LoadInterfazContable(){
    let data = await this.parametrosCiaService.loadParameterCia(localStorage.getItem('Id_Empresa'),'Inv_Interfaz_Contabilidad');
    if(data['total'] > 0){
      localStorage.setItem('TII',data['data'][0]['Valor']);
    }else{
      localStorage.setItem('TII','0');
    }
  }
  async LoadTiqueteCaja(){
    let data = await this.parametrosCiaService.loadParameterCia(localStorage.getItem('Id_Empresa'),'Ven_Tiquete_Caja');
    if(data['total'] > 0){
      localStorage.setItem('TTC',data['data'][0]['Valor']);
    }else{
      localStorage.setItem('TTC','0');
    }
  }
  async LoadIvaIncluido(){
    let data = await this.parametrosCiaService.loadParameterCia(localStorage.getItem('Id_Empresa'),'Ven_Iva_Incluido');
    if(data['total'] > 0){
      localStorage.setItem('TIVI',data['data'][0]['Valor']);
    }else{
      localStorage.setItem('TIVI','0');
    }
  }

  async emailValidation(){
    this.multiCompany = false;
    this.companies = [];
    if(this.registro.email == "")
     return false;
    let data =  await this.loginService.getUserCompany(this.registro.email);
    if(data['total'] == 0){
      Swal.fire('El Usuario no existe en el sistema');
      return false;
    }
    if(data['total'] > 1){
      this.multiCompany = true;
      this.companies = data['data'];
      this.registro.empresa = data['data'][0]['Id_Empresa'];
    }else{
      this.multiCompany = false;
      this.registro.empresa = data['data'][0]['Id_Empresa']
    }
    return true;
  }
}
