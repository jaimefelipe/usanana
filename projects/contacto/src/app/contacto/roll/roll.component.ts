import { Component, OnInit,Input } from '@angular/core';
import { SecurityUserService } from '../../../../../seguridad/src/app/security/security-user/security-user.service';
import { ContactoService } from '../contacto/contacto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roll',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.css']
})
export class RollComponent implements OnInit {
 @Input() Persona : any;
  constructor(
    private securityUserService:SecurityUserService,
    private contactoService:ContactoService
  ) { }

  PantallaUsuarios = false;
  Academico = false;
  
  searchFieldUsuario = '';

  Usuarios = [];
  
  ngOnInit() {
    const path = window.location.pathname;                 // ej: /academico/usuario
    const [modulo] = path.split('/').filter(Boolean); 
    if(modulo === 'academico'){
      this.Academico = true;
    }

  }
  searchUsuario(){
    this.leerUsuarios(this.searchFieldUsuario);
  }
  keytabUsuario(event){
    if (event.key === 'Enter') {
      this.searchUsuario();
    }
  }
  async abrirPantallaUsuarios(){
    this.leerUsuarios(this.searchFieldUsuario);
    this.PantallaUsuarios = true;
  }
  async leerUsuarios(searchField){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.securityUserService.loadAllUsers(paginacion,searchField);
    if(data['total']==0){
      this.Usuarios = [];
    }else{
      this.Usuarios = data['data'];
    }
  }
  cerrarPantallaUsuarios(){
    this.PantallaUsuarios = false;
  }

  selectUsuario(Usuario){
    this.Persona.Id_Usuario = Usuario.Id_Usuario;
    this.Persona.Nombre_Usuario = Usuario.Nombre;
    this.cerrarPantallaUsuarios();
  }

  async asociarUsuarioAutomatico(){
    if(this.Persona.Alumno != '1' && this.Persona.Profesor != '1' && this.Persona.Empleado != '1'){
      return;
    }
    const data = await this.contactoService.asociarUsuarioAutomatico(this.Persona);
    if(data['total'] == 0){
      Swal.fire('No se encontro un usuario con la identificacion o correo del contacto');
    }
  }
}
