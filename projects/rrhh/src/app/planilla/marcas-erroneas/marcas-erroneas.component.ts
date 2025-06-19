import { Component, OnInit, Input,SimpleChanges} from '@angular/core';
import { MarcasErroneasService } from './marcas-erroneas.service';
import { MarcasService } from '../../../../../contacto/src/app/contacto/marcas/marcas.service';

@Component({
  selector: 'app-marcas-erroneas',
  templateUrl: './marcas-erroneas.component.html',
  styleUrls: ['./marcas-erroneas.component.css']
})
export class MarcasErroneasComponent implements OnInit {
  @Input() Planilla : any;
  constructor(
    private marcasErroneasService:MarcasErroneasService,
    private marcasService:MarcasService
  ) { }
  PantallaMarca = false;
  MostrarPaginacion = false;
  searchField = "";
  tituloSeccion = 'Marcas Erroneas'
  Marcas = [];
  Marca = {
    Hora:'',
    Tipo:'',
    Id_Empresa:'',
    Id_Persona:'',
    NombreEmpresa:'',
    NombreEmpleado:'',
    Fecha:''
  }
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
      if (changes['Planilla'] && changes['Planilla'].currentValue) {
        this.leerMarcas();
      }
    }
  search(){

  }
  keytab(e){

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
    this.leerMarcas();
  }
  editRecord(marca){
    if(marca.Marca_Faltante =='Falta Salida'){
      this.Marca.Tipo = '2';
    }else{
      this.Marca.Tipo = '1';
    }
    this.Marca.Fecha = marca.Fecha_Incompleta;
    this.Marca.Id_Empresa = marca.Id_Empresa;
    this.Marca.NombreEmpresa = marca.NombreEmpresa;
    this.Marca.NombreEmpleado = marca.NombreEmpleado;
    this.Marca.Id_Persona = marca.Id_Persona;

    this.PantallaMarca = true

  }
  async leerMarcas(){
    let data = await this.marcasErroneasService.leerMarcas(this.Planilla.Id_Planilla);
    this.Marcas = data['data'];
  }
  
  async generarMarca(){
    this.Marca.Fecha = this.Marca.Fecha + ' ' + this.Marca.Hora;
    await this.marcasService.generarMarca(this.Marca.Id_Empresa,this.Marca.Id_Persona,this.Marca.Tipo,this.Marca.Fecha);
    this.leerMarcas();
  }
  cerrarPantallaMarca(){
    this.PantallaMarca = false
  }
}
