import { SecurityUserService } from './security-user.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-security-user',
  templateUrl: './security-user.component.html',
  styleUrls: ['./security-user.component.css']
})
export class SecurityUserComponent implements OnInit {

  constructor(
    private securityUserService:SecurityUserService
  ) { }
  Master = localStorage.getItem("ToxoMT");
  Users = [];
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Usuario  = {
    Id_Usuario: '',
    Nombre_Usuario:'',
    Nombre:'',
    Numero_Identificacion:'',
    Correo:'',
    Tipo_Usuario:'0',
    Estado:'',
    Clave:'',
    Ventas:'0',
    Compras:'0',
    Inventario:'0',
    CXC:'0',
    CXP:'0',
    CG:'0',
    BA:'0',
    Restaurante:'0',
    Seguridad:'0',
    Transporte:'0',
    Hospedaje:'0',
    Turismo:'0',
    Salonero:'',
    Academico:'',
    Pov:''
  }
  edit = false;
  ngOnInit(): void {
    this.loadUsers();
    if(this.Master !=='1'){
      this.Master = '0';
    }
  }
  async loadUsers(search?:any){
    let data = await this.securityUserService.loadAllUsers(this.paginacion,search);
    if(data['total'] == 0){
      this.Users = [];
    }else{
      this.Users = data['data'];
    }
  }
  ChangePage(action){
    if (action == 0) {
      this.paginacion.FirstRow = 1;
      this.paginacion.LastRow = 50;
    }
    if (action == 1) {
      if (this.paginacion.FirstRow < 50) {
        this.paginacion.FirstRow = 1;
        this.paginacion.LastRow = 50;
      } else {
        this.paginacion.FirstRow= this.paginacion.FirstRow -50;
        this.paginacion.LastRow= this.paginacion.LastRow -50;
      }
    }
    if (action == 2) {
      this.paginacion.FirstRow = this.paginacion.FirstRow +50;
      this.paginacion.LastRow = this.paginacion.LastRow + 50;
    }
    this.loadUsers();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadUsers(this.searchField);
  }
  async editRecord(Usuario){
    this.edit = true;
    if(Usuario){
      let data = await this.securityUserService.loadUser(Usuario.Id_Usuario);
      if(data['total']==1){
        this.Usuario = data['data'][0];
      }
    }else{
      this.Usuario  = {
        Id_Usuario: '',
        Nombre_Usuario:'',
        Numero_Identificacion:'',
        Nombre:'',
        Correo:'',
        Tipo_Usuario:'0',
        Estado:'1',
        Clave:'',
        Ventas:'0',
        Compras:'0',
        Inventario:'0',
        CXC:'0',
        CXP:'0',
        CG:'0',
        BA:'0',
        Restaurante:'0',
        Seguridad:'0',
        Transporte:'0',
        Hospedaje:'0',
        Turismo:'0',
        Salonero:'',
        Academico:'',
        Pov:''
      }
    }
  }
  async grabar(){
    if(this.Usuario.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre del Usuario');
      return false;
    }
    if(this.Usuario.Correo == ""){
      Swal.fire('Favor Suministrar Usuario');
      return false;
    }
    if(this.Usuario.Id_Usuario == ''){
      //Nuevo
      //Validar si el Usuario ya existe en la base de datos
      let existe = await this.securityUserService.validateUser(this.Usuario.Correo);
      if(existe['total'] >0) {
        Swal.fire('El Nombre de Usuario no esta Disponible para ser utilizado')
        return false;
      }
      //Crear el usuario
      let data = await this.securityUserService.inserUsert(this.Usuario);
      let Id_Usuario = data['data']['0']['Identity'];

      //Asociar el usuario a la empresa
      await this.securityUserService.AsociarUsuario(Id_Usuario,localStorage.getItem('Id_Empresa'))
    }else{
      //Update
      this.securityUserService.updateUser(this.Usuario);
      this.securityUserService.ChangeUserStatus(this.Usuario.Id_Usuario,localStorage.getItem('Id_Empresa'),this.Usuario.Estado);
    }
    this.loadUsers(this.searchField);
    this.cancel();
    return true;
  }
  cancel(){
    this.edit = false;
  }
}
