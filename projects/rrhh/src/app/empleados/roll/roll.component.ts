import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RollService } from '../roll/roll.service';
import { BranchService } from '../../../../../main/src/app/general/branch/branch.service';
import { ContactoService } from '../../../../../contacto/src/app/contacto/contacto/contacto.service';

@Component({
  selector: 'app-roll',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.css']
})
export class RollComponent implements OnInit {
  constructor(
    private RollService:RollService,
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

  Rolles = [];
  Provinces = [];
  Cantons = [];
  Districts = [];
  Clientes = [];

  Roll = {
    Id_Roll:'',
    Codigo:'',
    Nombre:'',
    Lunes:'',
    Inicio_Lunes:'',
    Fin_Lunes:'',
    Martes:'',
    Inicio_Martes:'',
    Fin_Martes:'',
    Miercoles:'',
    Inicio_Miercoles:'',
    Fin_Miercoles:'',
    Jueves:'',
    Inicio_Jueves:'',
    Fin_Jueves:'',
    Viernes:'',
    Inicio_Viernes:'',
    Fin_Viernes:'',
    Sabado:'',
    Inicio_Sabado:'',
    Fin_Sabado:'',
    Domingo:'',
    Inicio_Domingo:'',
    Fin_Domingo:'',
    Estado:'1'
  }

  ngOnInit(): void {
    this.loadRolles();
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
    this.loadRolles();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search(){
    this.loadRolles(this.searchField);
  }
 
  /**
   * Eventos del
   * Formulario de edición
   */
   cancel(){
     this.edit = false;
   }
   editRecord(Roll){
    this.edit = true;
    if(Roll){
        this.loadRoll(Roll.Id_Roll);
    }else{
      this.Roll = {
        Id_Roll:'',
        Codigo:'',
        Nombre:'',
        Lunes:'',
        Inicio_Lunes:'',
        Fin_Lunes:'',
        Martes:'',
        Inicio_Martes:'',
        Fin_Martes:'',
        Miercoles:'',
        Inicio_Miercoles:'',
        Fin_Miercoles:'',
        Jueves:'',
        Inicio_Jueves:'',
        Fin_Jueves:'',
        Viernes:'',
        Inicio_Viernes:'',
        Fin_Viernes:'',
        Sabado:'',
        Inicio_Sabado:'',
        Fin_Sabado:'',
        Domingo:'',
        Inicio_Domingo:'',
        Fin_Domingo:'',
        Estado:'1'
      }
    }
   }
  async loadRolles(search?:any){
    let data = await this.RollService.loadRolles(this.paginacion,search);
    if(data['total'] == 0){
      this.Rolles = [];
    }else{
      this.Rolles = data['data'];
    }
  }
  async loadRoll(Id_Roll){
    let data = await this.RollService.loadRoll(Id_Roll);
    
    if(data['total'] == 0){
      this.Roll = {
        Id_Roll:'',
        Codigo:'',
        Nombre:'',
        Lunes:'',
        Inicio_Lunes:'',
        Fin_Lunes:'',
        Martes:'',
        Inicio_Martes:'',
        Fin_Martes:'',
        Miercoles:'',
        Inicio_Miercoles:'',
        Fin_Miercoles:'',
        Jueves:'',
        Inicio_Jueves:'',
        Fin_Jueves:'',
        Viernes:'',
        Inicio_Viernes:'',
        Fin_Viernes:'',
        Sabado:'',
        Inicio_Sabado:'',
        Fin_Sabado:'',
        Domingo:'',
        Inicio_Domingo:'',
        Fin_Domingo:'',
        Estado:'1'
      }
    }else{
      this.Roll = data['data'][0];
    }
  }
  async grabar(){
    
   
    let data = await this.RollService.saveRoll(this.Roll);

    if(data['success'] == 'true'){
      Swal.fire('Cuenta grabada correctamente');
      this.loadRolles(this.searchField);
      this.edit = false;
    }
    return true;
  }
  

}
