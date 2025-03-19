import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PeopleService } from './people.service';
import { BranchService } from '../branch/branch.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  constructor(
    private peopleService:PeopleService,
    private branchService:BranchService
    ) { }
  Personas = [];
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  edit = false;
  interfazContable = localStorage.getItem("InterfazContable");
  Provinces = [];
  Cantons = [];
  Districts = [];
  /**
   * Variables del
   * Formulario de Edición
   */
  Persona = {
    Id_Persona:'',
    Nombre: '',
    Telefono:'',
    Correo:'',
    Identificacion:'',
    Tipo_Identificacion:'1',
    Provincia:'',
    Canton : '',
    Distrito:'',
    Barrio:'',
    Otras_Senas:'',
    Proveedor:'',
    Cliente:'',
    Empleado:''
  }
  ngOnInit(): void {
    this.loadPersonas();
    this.loadProvinces();
  }
  async loadPersonas(search?:any){
    let data = await this.peopleService.loadPersonas(this.paginacion,search);
    if(data['total'] == 0){
      this.Personas = [];
    }else{
      this.Personas = data['data'];
    }
  }
  async editRecord(Persona){
    this.edit = true;
    if(Persona){
      this.Persona.Id_Persona = Persona.Id_Persona;
      this.loadPersona();
    }else{
      this.Persona = {
        Id_Persona:'',
        Nombre: '',
        Telefono:'',
        Correo:'',
        Identificacion:'',
        Tipo_Identificacion:'1',
        Provincia:'',
        Canton : '',
        Distrito:'',
        Barrio:'',
        Otras_Senas:'',
        Proveedor:'',
        Cliente:'',
        Empleado:''
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
    this.loadPersonas();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.loadPersonas(this.searchField);
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   async grabar(){
    if(this.Persona.Nombre == ""){
      Swal.fire('Favor Suministrar el nombre de la Categoria');
      return false;
    }
    let data = await this.peopleService.savePersona(this.Persona);
    if(data['success'] =='true'){
      Swal.fire('Categoria grabada correctamente');
      this.loadPersonas(this.searchField);
      this.edit = false;
    }
    return true;
   }
   async loadPersona(){
    let data = await this.peopleService.loadPersona(this.Persona.Id_Persona);
    if(data['total']==1){
      this.Persona = data['data'][0];
    }
   }
   async loadProvinces() {
    let data = await this.branchService.loadProvinces();
    if (data['total'] > 0) {
      this.Provinces = data['data'];
      if (this.Persona.Provincia == '') {
        this.Persona.Provincia = this.Provinces[0]['Provincia'];
      }
      await this.loadCantons(this.Persona.Provincia);
    }
  }
  async loadCantons(Province) {
    let data = await this.branchService.LoadCantons(Province);
    if (data['total'] > 0) {
      this.Cantons = data['data'];
      if (this.Persona.Canton == '') {
        this.Persona.Canton = this.Cantons[0]['Canton'];
      }
      await this.loadDistrict(this.Persona.Provincia, this.Persona.Canton);
    }
  }
  async loadDistrict(Province, Canton) {
    let data = await this.branchService.LoadDistrito(Province, Canton);
    if (data['total'] > 0) {
      this.Districts = data['data'];
      if (this.Persona.Distrito == '') {
        this.Persona.Distrito = this.Cantons[0]['Canton'];
      }
    }
  }
  async provinceChange() {
    await this.loadCantons(this.Persona.Provincia);
  }
  async cantonChange() {
    await this.loadDistrict(this.Persona.Provincia, this.Persona.Canton);
  }
}
