import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LocalidadService } from './localidad.service';
import { BranchService } from '../../../../../main/src/app/general/branch/branch.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';

@Component({
  selector: 'app-localidad',
  templateUrl: './localidad.component.html',
  styleUrls: ['./localidad.component.css']
})
export class LocalidadComponent implements OnInit {

  constructor(private LocalidadService:LocalidadService,
    private branchService:BranchService,
    private peopleService:ContactoService
  ) { }

  edit = false;
  PantallaClientes = false;

  searchField = '';
  searchFieldClientes = '';
  
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };

  Localidades = [];
  Provinces = [];
  Cantons = [];
  Districts = [];
  Clientes = [];

  Localidad = {
    Id_Localidad:'',
    Codigo:'',
    Localidad:'',
    Id_Persona:'',
    Provincia:'',
    Canton:'',
    Distrito:'',
    Barrio:'',
    Direccion:'',
    Estado:'1',
    Cliente:''
  }

  ngOnInit(): void {
    this.loadProvinces();
    this.loadLocalidades();
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
    this.loadLocalidades();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  keytabClientes(event){
    if (event.key === 'Enter') {
      this.searchClientes();
    }
  }
  search(){
    this.loadLocalidades(this.searchField);
  }
  searchClientes(){
    this.cargarClientes();
  }
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Localidad){
    this.edit = true;
    if(Localidad){
        this.loadLocalidad(Localidad.Id_Localidad);
    }else{
      this.Localidad = {
        Id_Localidad:'',
        Codigo:'',
        Localidad:'',
        Id_Persona:'',
        Provincia:'',
        Canton:'',
        Distrito:'',
        Barrio:'',
        Direccion:'',
        Estado:'1',
        Cliente:''
      }
    }
   }
  async loadLocalidades(search?:any){
    let data = await this.LocalidadService.loadLocalidades(this.paginacion,search);
    if(data['total'] == 0){
      this.Localidades = [];
    }else{
      this.Localidades = data['data'];
    }
  }
  async loadLocalidad(Id_Localidad){
    let data = await this.LocalidadService.loadLocalidad(Id_Localidad);
    
    if(data['total'] == 0){
      this.Localidad = {
        Id_Localidad:'',
        Codigo:'',
        Localidad:'',
        Id_Persona:'',
        Provincia:'',
        Canton:'',
        Distrito:'',
        Barrio:'',
        Direccion:'',
        Estado:'1',
        Cliente:''
      }
    }else{
      this.Localidad = data['data'][0];
      this.ProvinciaChange();

    }
  }
  async grabar(){
    if(this.Localidad.Localidad == ""){
      Swal.fire('Favor suministrar el nombre ');
      return false;
    }
    if(this.Localidad.Id_Persona ==""){
      Swal.fire('Favor suministrar el Cliente ');
      return false;
    }
    if(this.Localidad.Codigo ==""){
      Swal.fire('Favor suministrar el Codigo ');
      return false;
    }
    if(this.Localidad.Provincia ==""){
      Swal.fire('Favor suministrar La Provincia ');
      return false;
    }
    if(this.Localidad.Canton ==""){
      Swal.fire('Favor suministrar La Canton ');
      return false;
    }
    if(this.Localidad.Distrito ==""){
      Swal.fire('Favor suministrar La Distrito ');
      return false;
    }
    if(this.Localidad.Direccion ==""){
      Swal.fire('Favor suministrar La Direccion ');
      return false;
    }
   
    let data = await this.LocalidadService.saveLocalidad(this.Localidad);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadLocalidades(this.searchField);
      this.edit = false;
    }
    return true;
  }
  async loadProvinces() {
    let data = await this.branchService.loadProvinces();
    if (data['total'] > 0) {
      this.Provinces = data['data'];
      if (this.Localidad.Provincia == '') {
        this.Localidad.Provincia = this.Provinces[0]['Provincia'];
      }
      await this.loadCantons(this.Localidad.Provincia);
    }
  }
  async loadCantons(Province) {
    let data = await this.branchService.LoadCantons(Province);
    if (data['total'] > 0) {
      this.Cantons = data['data'];
      if (this.Localidad.Canton == '') {
        this.Localidad.Canton = this.Cantons[0]['Canton'];
      }
      await this.loadDistrict(this.Localidad.Provincia, this.Localidad.Canton);
    }
  }
  async loadDistrict(Province, Canton) {
    let data = await this.branchService.LoadDistrito(Province, Canton);
    if (data['total'] > 0) {
      this.Districts = data['data'];
      if (this.Localidad.Distrito == '') {
        this.Localidad.Distrito = this.Cantons[0]['Canton'];
      }
    }
  }
  async ProvinciaChange() {
    await this.loadCantons(this.Localidad.Provincia);
  }
  async CantonChange() {
    await this.loadDistrict(this.Localidad.Provincia, this.Localidad.Canton);
  }

  OpenClientePanel(){
    this.cargarClientes();
    this.PantallaClientes = true;
  }
  SeleccionarCliente(Cliente){
    this.Localidad.Id_Persona = Cliente.Id_Persona;
    this.Localidad.Cliente = Cliente.Nombre;
    this.closePantallaClientes();
  }
  closePantallaClientes(){
    this.PantallaClientes = false;
  }
  async cargarClientes(){
    let paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0,
    };
    let data = await this.peopleService.loadPersonas(paginacion, this.searchFieldClientes, 1); 
    this.Clientes = data['data'];
  }
}
