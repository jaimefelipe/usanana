import { Component, OnInit } from '@angular/core';
import { UsuarioEmpresaService } from './usuario-empresa.service';
import { CompanyService } from '../../../../../main/src/app/general/company/company.service';
import { SecurityUserService } from '../security-user/security-user.service';


@Component({
  selector: 'app-usuario-empresa',
  templateUrl: './usuario-empresa.component.html',
  styleUrls: ['./usuario-empresa.component.css']
})
export class UsuarioEmpresaComponent implements OnInit {

  constructor(
    private usuarioEmpresaService:UsuarioEmpresaService,
    private companyService:CompanyService,
    private securityUserService:SecurityUserService
  ) { }
  edit = false;

  searchField = '';

  UsuariosEmpresas = [];
  Companias = [];
  Usuarios = [];

  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  UsuarioEmpresa = {
    Id_Usuario_Empresa:'',
    Id_Empresa:'',
    Nombre_Empresa:'',
    Id_Usuario:'',
    Nombre_Usuario:'',
    Numero_Identificacion:'',
    Estado:''
  }
  ngOnInit() {
    this.cargarUsuariosEmpresa();
    this.loadCompanies();
    this.loadUsers();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.cargarUsuariosEmpresa(this.searchField);
  }
  async cargarUsuariosEmpresa(search?){
    let data = await this.usuarioEmpresaService.cargarUsuariosEmpresa(this.paginacion,search);
    if(data['total'] == 0){
      this.UsuariosEmpresas = [];
    }else{
      this.UsuariosEmpresas = data['data'];
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
    this.cargarUsuariosEmpresa();
  }
  async editRecord(UsuarioEmpresa){
    this.edit = true
    if(UsuarioEmpresa){
      let data = await this.usuarioEmpresaService.cargarUsuarioEmpresa(UsuarioEmpresa.Id_Usuario_Empresa);
      if(data['total']==1){
        this.UsuarioEmpresa = data['data'][0];
      }
    }
  }

  grabar(){
    //Cargar Datos del usuario
    //Recorrer el array para obtener datos
    
    for (let usuario of this.Usuarios) {
      if(usuario.Id_Usuario == this.UsuarioEmpresa.Id_Usuario){
        this.UsuarioEmpresa.Nombre_Usuario = usuario.Nombre;
        this.UsuarioEmpresa.Numero_Identificacion = usuario.Numero_Identificacion;
      }
    }

    if(this.UsuarioEmpresa.Id_Usuario_Empresa == ''){
      let data = this.usuarioEmpresaService.inserUsert(this.UsuarioEmpresa);
    }else{
      let data = this.usuarioEmpresaService.updateUser(this.UsuarioEmpresa);
    }
    this.cancel();
  }
  cancel(){
    this.edit = false;
  }

  async loadCompanies(search?:any){
    let data = await this.companyService.loadCompanies();
    if(data['total'] == 0){
      this.Companias = [];
    }else{
      this.Companias = data['data'];
    }
  }

  async loadUsers(search?:any){
    let data = await this.securityUserService.loadAllUsers(this.paginacion,search);
    if(data['total'] == 0){
      this.Usuarios = [];
    }else{
      this.Usuarios = data['data'];
    }
  }

}
