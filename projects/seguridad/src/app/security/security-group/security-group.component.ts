import { SecurityGroupService } from './security-group.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-security-group',
  templateUrl: './security-group.component.html',
  styleUrls: ['./security-group.component.css']
})
export class SecurityGroupComponent implements OnInit {
  constructor(private securityGroupService:SecurityGroupService) { }
  interfazInventario = false;
  appRestaurante = false;
  SeguridadStr = localStorage.getItem("ToxoSG");
  Seguridad = [];
  Grupos = [];
  searchField = ""
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
  Grupo = {
    Id_Grupo:'',
    Nombre: '',
    Estado:'1'
  }
  ngOnInit(): void {
    if(this.SeguridadStr == ""){
      this.SeguridadStr = "0.0.0.0.0.0.0.0";
    }
    this.Seguridad = this.SeguridadStr.split(".");
    if(this.Seguridad[3] ==1){this.interfazInventario = true}
    if(this.Seguridad[7] ==1){this.appRestaurante = true}
    this.loadGrupos();
  }
  async loadGrupos(search?:any){
    let data = await this.securityGroupService.loadGrupos(this.paginacion,search);
    if(data['total'] == 0){
      this.Grupos = [];
    }else{
      this.Grupos = data['data'];
    }
  }
  async editRecord(Grupo){
    this.edit = true;
    if(Grupo){
      this.Grupo.Id_Grupo = Grupo.Id_Grupo;
      this.loadGrupo();
    }else{
      this.Grupo = {
        Id_Grupo:'',
        Nombre: '',
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
    this.loadGrupos();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadGrupos(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Grupo.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre de la Grupo');
      return false;
    }
    let data = await this.securityGroupService.saveGrupo(this.Grupo);
    if(data['success'] =='true'){
      Swal.fire('Grupo grabada correctamente');
      this.loadGrupos(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadGrupo(){
    let data = await this.securityGroupService.loadGrupo(this.Grupo.Id_Grupo);
    if(data['total']==1){
      this.Grupo = data['data'][0];
    }
   }

}
