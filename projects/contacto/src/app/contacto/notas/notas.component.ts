import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ContactoService } from '../contacto/contacto.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent implements OnInit {
  @Input() Persona : any;
  constructor(
    private contactoService:ContactoService
  ) { }

  PantallaNotas = false;
  searchField = '';
  Notas = [];
  Nota = {
    Id_Notas:'',
    Id_Persona:'',
    Nota:''
  }

  ngOnInit(): void {
    this.loadNotas();
  }

  ngOnChanges(changes: SimpleChanges) {
    //Evento se dispara cuando hay cambios en el padre
    this.loadNotas();
  }
  search(){

  }
  keytab(e){

  }
  abrirPantallaNotas(Nota){
    if(Nota){
      this.Nota = Nota;
    }else{
      this.Nota = {
        Id_Notas:'',
        Id_Persona:'',
        Nota:''
      }
    }
    this.PantallaNotas = true;
    //this.loadNotas();
  }
  async GrabarNota(){
    if(this.Nota.Nota = ''){
      Swal.fire('No Puede grabar una nota en blanco');
      return false;
    }
    this.Nota.Nota = (document.getElementById('Nota') as HTMLInputElement).value
    this.Nota.Id_Persona = this.Persona.Id_Persona;
    if(this.Nota.Id_Notas == ''){
      let data = await this.contactoService.insertNota(this.Nota);
    }else{
      let data = await this.contactoService.updateNota(this.Nota);
    }

    this.Nota = {
      Id_Notas:'',
      Id_Persona:'',
      Nota:''
    }
    this.cerrarPantallaNotas();
    this.loadNotas();
    return true;
  }
  cerrarPantallaNotas(){
    this.PantallaNotas = false;
  }
  async loadNota(Nota){
    let data = await this.contactoService.loadNota(Nota.Id_Notas);
    if(data['total'] != 0){
      this.Nota = data['data'][0];
    }
  }

  async loadNotas(search?:any){
    let data = await this.contactoService.loadNotas(this.Persona.Id_Persona);
    if(data['total'] == 0){
      this.Notas = [];
    }else{
      this.Notas = data['data'];
    }
  }

  
}
