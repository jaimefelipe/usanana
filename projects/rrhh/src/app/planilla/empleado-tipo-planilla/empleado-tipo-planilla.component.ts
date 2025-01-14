import { Component, OnInit } from '@angular/core';
import { EmpleadoTipoPlanillaService } from './empleado-tipo-planilla.service';
import { TipoPlanillaService } from '../tipo-planilla/tipo-planilla.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';

@Component({
  selector: 'app-empleado-tipo-planilla',
  templateUrl: './empleado-tipo-planilla.component.html',
  styleUrls: ['./empleado-tipo-planilla.component.css']
})
export class EmpleadoTipoPlanillaComponent implements OnInit {

   constructor(
      private empleadoTipoPlanillaService:EmpleadoTipoPlanillaService,
      private contactoService:ContactoService,
      private tipoPlanillaService:TipoPlanillaService
    ) { }
  
    edit = false;
  
    searchField = '';
  
    empleadoTipos = [];
    Tipos = [];
    empleados = [];
  
    paginacion = {
      FirstRow: 1,
      LastRow: 50,
      TotalRows: 0
    };
  
    empleado_Tipo_Planilla = {
      Id_empleado_Tipo_Planilla:'',
      Id_Tipo_Planilla:'',
      Id_empleado_Salarial:'',
      Estado:'1'
    }
  
    ngOnInit() {
      this.leerTipoPlanilla();
      this.leerempleadoSalariales();
      this.loadempleadosTipos();
    }
    keytab(event){
      if (event.key === 'Enter') {
        this.search();
      }
    }
    search(){
      this.loadempleadosTipos(this.searchField);
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
      this.loadempleadosTipos();
    }
    async editRecord(empleadoTipo){
      this.edit = true;
      if(empleadoTipo){
          await this.loadempleadosTipos(empleadoTipo.Id_empleado_Tipo_Planilla);
      }else{
        this.empleado_Tipo_Planilla = {
          Id_empleado_Tipo_Planilla:'',
          Id_Tipo_Planilla:'',
          Id_empleado_Salarial:'',
          Estado:'1'
        }
      }
    }
    
    async loadempleadoTipoPlanilla(Id_empleado_Tipo_Planilla){
      let data = await this.empleadoTipoPlanillaService.loadempleadoTIpoPlanilla(Id_empleado_Tipo_Planilla);
      if(data['total'] == 0){
        this.empleado_Tipo_Planilla = {
          Id_empleado_Tipo_Planilla:'',
          Id_Tipo_Planilla:'',
          Id_empleado_Salarial:'',
          Estado:'1'
        }
      }else{
        this.empleado_Tipo_Planilla = data['data'][0];
      }
    }
  
    async loadempleadosTipos(search?){
      let data = await this.empleadoTipoPlanillaService.loadempleadosTipoPlanilla(this.paginacion,search);
      if(data['total'] == 0){
        this.empleadoTipos = [];
      }else{
        this.empleadoTipos = data['data'];
      }
    }
  
    async grabar(){
      this.empleadoTipoPlanillaService.saveempleadoTipoPlanilla(this.empleado_Tipo_Planilla);
      this.loadempleadosTipos();
      this.cancel();
    }
    cancel(){
      this.edit = false;
      
    }
  
    async leerempleadoSalariales(){
      let  paginacion = {
        FirstRow: 1,
        LastRow: 500,
        TotalRows: 0
      };
      let data = await this.contactoService.loadPersonas(this.paginacion,'',5);
      if(data['total'] == 0){
        this.empleados = [];
      }else{
        this.empleados = data['data'];
      }
  
    }
    async leerTipoPlanilla(){
      let  paginacion = {
        FirstRow: 1,
        LastRow: 500,
        TotalRows: 0
      };
      let data = await this.tipoPlanillaService.loadTipos(paginacion,'');
      if(data['total'] == 0){
        this.Tipos = [];
      }else{
        this.Tipos = data['data'];
      }
    }
}