import { SecurityAppGroupService } from './security-app-group.service';
import { SecurityGroupService } from '../security-group/security-group.service';
import { SecurityAppService } from '../security-app/security-app.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-security-app-group',
  templateUrl: './security-app-group.component.html',
  styleUrls: ['./security-app-group.component.css']
})
export class SecurityAppGroupComponent implements OnInit {

 constructor(
   private securityAppGroupService:SecurityAppGroupService,
   private securityGroupService:SecurityGroupService,
   private SecurityAppService:SecurityAppService
   ) { }
  interfazInventario = false;
  PantallaGrupos = false;
  PantallaApp = false;
  appRestaurante = false;
  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  Grupos = [];
  Apps = [];
  AppGrupos = [];
  searchField = ""
  searchFieldGrupos = "";
  searchFieldApp = "";
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  interfazContable = localStorage.getItem("InterfazContable");

  /**
   * Variables del
   * Formulario de Edición
   */
  AppGrupo = {
    Id_App_Grupo:'',
    Id_App:'',
    Id_Grupo:'',
    Nombre: '',
    Editar: '0',
    Agregar: '0',
    Titulo:'',
    Estado:'1'
  }
  ngOnInit(): void {
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    if(this.Seguridad[3] ==1){this.interfazInventario = true}
    if(this.Seguridad[7] ==1){this.appRestaurante = true}
    this.loadAppGrupos();
  }
  async loadAppGrupos(search?:any){
    let data = await this.securityAppGroupService.loadAppGrupos(this.paginacion,search);
    if(data['total'] == 0){
      this.AppGrupos = [];
    }else{
      this.AppGrupos = data['data'];
    }
  }
  async editRecord(Grupo){
    this.edit = true;
    if(Grupo){
      this.AppGrupo.Id_App_Grupo = Grupo.Id_App_Grupo;
      this.loadAppGrupo();
    }else{
      this.AppGrupo = {
        Id_App_Grupo:'',
        Id_App:'',
        Id_Grupo:'',
        Nombre: '',
        Editar: '0',
        Agregar: '0',
        Titulo:'',
        Estado:'1'
      }
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
    this.loadAppGrupos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabGrupos(event){
    if (event.key === 'Enter') {
      this.searchGrupos();
    }
  }
  keytabApp(event){
    if (event.key === 'Enter') {
      this.searchApps();
    }
  }
  search(){
    this.loadAppGrupos(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   closePantallaGrupo(){
    this.PantallaGrupos = false
   }
   closePantallaApp(){
    this.PantallaApp = false
   }
   async grabar(){
    if(this.AppGrupo.Id_App == ""){
      Swal.fire('Favor Suministrar la Aplicación');
      return false;
    }
    if(this.AppGrupo.Id_Grupo == ""){
      Swal.fire('Favor Suministrar el Grupo');
      return false;
    }
    let data = await this.securityAppGroupService.saveAppGrupo(this.AppGrupo);
    if(data['success'] =='true'){
      Swal.fire('Grupo grabada correctamente');
      this.loadAppGrupos(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadAppGrupo(){
    let data = await this.securityAppGroupService.loadAppGrupo(this.AppGrupo.Id_App_Grupo);
    if(data['total']==1){
      this.AppGrupo = data['data'][0];
    }
   }
   async openGrupoPanel (){
    this.PantallaGrupos =true;
    this.searchGrupos();
   }
   async searchGrupos(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let grupos = await this.securityGroupService.loadGrupos(paginacion,this.searchFieldGrupos);
    this.Grupos = grupos['data'];
   }
   async searchApps(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
    let data = await this.SecurityAppService.loadApps(paginacion,this.searchFieldApp);
    this.Apps = data['data'];
   }
   SeleccionarGrupo(grupo){
    this.AppGrupo.Id_Grupo = grupo.Id_Grupo;
    this.AppGrupo.Nombre = grupo.Nombre;
    this.closePantallaGrupo();
   }
   openAppPanel(){
    this.PantallaApp = true;
    this.searchApps();
   }
   SeleccionarApp(App){
    this.AppGrupo.Id_App = App.Id_App;
    this.AppGrupo.Titulo = App.Titulo;
    this.closePantallaApp();
   }
}
