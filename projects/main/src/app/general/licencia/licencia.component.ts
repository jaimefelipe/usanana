import { Component, OnInit } from '@angular/core';
import { NgbDateFRParserFormatter } from '../../../../../core/src/app/_services/ngb-date-fr-parser-formatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { LicenciaService } from './licencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-licencia',
  templateUrl: './licencia.component.html',
  styleUrls: ['./licencia.component.css'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class LicenciaComponent implements OnInit {

  constructor(private licenciaService:LicenciaService) { }
  edit = false;
  hoy = new Date();
  FechaVencimiento =  {
    month: this.hoy.getMonth() + 1,
    day: this.hoy.getDate(),
    year: this.hoy.getFullYear()
  }
  Licencias = [];
  searchField = ""
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  Licencia = {
    Id_Producto:'',
    Id_Sub_Categoria:'',
    Descripcion:'',
    Nombre:'',
    Fecha_Vencimiento:this.FechaVencimiento.day + '/' + this.FechaVencimiento.month + '/' + this.FechaVencimiento.year,
    Cantidad_Disponible:'',
    Empresa_Estado:'1'
  }
  ngOnInit(): void {
    this.getLicencias();
  }
  async getLicencias(search?){
    let data = await this.licenciaService.getLicencias(this.paginacion,search);
    this.Licencias = data['data'];
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
    this.getLicencias();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    this.getLicencias(this.searchField);
  }
  editRecord(Licencia){

    this.edit = true;
    if(Licencia){
      this.Licencia = Licencia;

      let fechaArr = this.Licencia['Fecha_Vencimiento'].split('/');
      this.FechaVencimiento = {
        month: parseInt(fechaArr[1]),
        day: parseInt(fechaArr[0]),
        year: parseInt(fechaArr[2]),
      }
    }else{
      this.Licencia = {
        Id_Producto:'',
        Id_Sub_Categoria:'',
        Descripcion:'',
        Nombre:'',
        Fecha_Vencimiento:this.FechaVencimiento.day + '/' + this.FechaVencimiento.month + '/' + this.FechaVencimiento.year,
        Cantidad_Disponible:'',
        Empresa_Estado:'1'
      }
    }
  }


  async grabar(){
    this.Licencia.Fecha_Vencimiento = this.FechaVencimiento.month + '/' +  this.FechaVencimiento.day + '/' + this.FechaVencimiento.year;
    let data = await this.licenciaService.updateLicencia(this.Licencia);
    if(data['success'] =='true'){
      Swal.fire('Registro grabada correctamente');
      this.getLicencias(this.searchField);
      this.edit = false;
    }
  }
  cancel(){
    this.edit = false;
  }

}
