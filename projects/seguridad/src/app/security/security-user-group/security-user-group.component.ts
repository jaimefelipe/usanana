import { SecurityUserGroupService } from './security-user-group.service';
import { SecurityGroupService } from '../security-group/security-group.service';
import { SecurityUserService } from '../security-user/security-user.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-security-user-group',
  templateUrl: './security-user-group.component.html',
  styleUrls: ['./security-user-group.component.css']
})
export class SecurityUserGroupComponent implements OnInit {

  constructor(
    private securityUserGroupService:SecurityUserGroupService,
    private securityGroupService:SecurityGroupService,
    private securityUserService:SecurityUserService
    ) { }
   interfazInventario = false;
   PantallaGrupos = false;
   PantallaApp = false;
   appRestaurante = false;
   SeguridadStr = localStorage.getItem("ToxoSG");
   Seguridad = [];
   Grupos = [];
   Apps = [];
   UserGrupos = [];
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
   UserGrupo = {
     Id_Usuario_Grupo:'',
     Id_Usuario:'',
     Id_Grupo:'',
     Grupo: '',
     Usuario: '',
     Estado:'1'
   }
   ngOnInit(): void {
     if(this.SeguridadStr == ""){
       this.SeguridadStr = "0.0.0.0.0.0.0.0";
     }
     this.Seguridad = this.SeguridadStr.split(".");
     if(this.Seguridad[3] ==1){this.interfazInventario = true}
     if(this.Seguridad[7] ==1){this.appRestaurante = true}
     this.loadUserGrupos();
   }
   async loadUserGrupos(search?:any){
     let data = await this.securityUserGroupService.loadUserGrupos(this.paginacion,search);
     if(data['total'] == 0){
       this.UserGrupos = [];
     }else{
       this.UserGrupos = data['data'];
     }
   }
   async editRecord(Grupo){
     this.edit = true;
     if(Grupo){
       this.UserGrupo.Id_Usuario_Grupo = Grupo.Id_Usuario_Grupo;
       this.loadUserGrupo();
     }else{
       this.UserGrupo = {
         Id_Usuario_Grupo:'',
         Id_Usuario:'',
         Id_Grupo:'',
         Grupo: '',
         Usuario: '',
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
     this.loadUserGrupos();
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
     this.loadUserGrupos(this.searchField);
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
     if(this.UserGrupo.Id_Usuario == ""){
       Swal.fire('Favor Suministrar el Usuario');
       return false;
     }
     if(this.UserGrupo.Id_Grupo == ""){
       Swal.fire('Favor Suministrar el Grupo');
       return false;
     }
     let data = await this.securityUserGroupService.saveUserGrupo(this.UserGrupo);
     if(data['success'] =='true'){
       Swal.fire('Grupo grabada correctamente');
       this.loadUserGrupos(this.searchField);
       this.edit = false;
     }
     return true;
    }
    async loadUserGrupo(){
     let data = await this.securityUserGroupService.loadUserGrupo(this.UserGrupo.Id_Usuario_Grupo);
     if(data['total']==1){
       this.UserGrupo = data['data'][0];
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
     let data = await this.securityUserService.loadUsers(paginacion,this.searchFieldApp);
     this.Apps = data['data'];
    }
    SeleccionarGrupo(grupo){
     this.UserGrupo.Id_Grupo = grupo.Id_Grupo;
     this.UserGrupo.Grupo = grupo.Nombre;
     this.closePantallaGrupo();
    }
    openAppPanel(){
     this.PantallaApp = true;
     this.searchApps();
    }
    SeleccionarApp(App){
     this.UserGrupo.Id_Usuario = App.Id_Usuario;
     this.UserGrupo.Usuario = App.Nombre;
     this.closePantallaApp();
    }

}
