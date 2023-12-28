import { Component, OnInit } from '@angular/core';
import { PresentacionService } from './presentacion.service';


@Component({
  selector: 'app-presentacion',
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements OnInit {

  constructor(
    private presentacionService:PresentacionService
  ) { }
  Tareas = [];
  BloqueA = [];
  BloqueB = [];
  Presentado = [];
  ngOnInit(): void {
    this.leerBloqueA();
    this.leerBloqueB();
    this.leerPresentado();
  }
  editRecord(t){}

  async leerBloqueA(){
    let data = await this.presentacionService.LeerBloqueA();
    if(data['total'] == 0){
      this.BloqueA = [];
    }else{
      this.BloqueA = data['data'];
    }
  }
  async leerBloqueB(){
    let data = await this.presentacionService.LeerBloqueB();
    if(data['total'] == 0){
      this.BloqueB = [];
    }else{
      this.BloqueB = data['data'];
    }
  }
  async leerPresentado(){
    let data = await this.presentacionService.LeerPresentado();
    if(data['total'] == 0){
      this.Presentado = [];
    }else{
      this.Presentado = data['data'];
    }
  }
  terminado(Cliente){
    this.presentacionService.PonerTerminado(Cliente.Id_Persona);
    this.leerBloqueA();
    this.leerBloqueB();
    this.leerPresentado();
  }
  Pendiente(Cliente){
    this.presentacionService.PonerPendiente(Cliente.Id_Persona);
    this.leerBloqueA();
    this.leerBloqueB();
    this.leerPresentado();
  }
}
