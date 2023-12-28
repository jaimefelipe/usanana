import { Component, OnInit } from '@angular/core';
import { MarcasService } from './marcas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {

  constructor(
    private marcasService:MarcasService
  ) { }

  Marca = {
    Codigo : '',
    Nombre : '',
    Fecha : '',
    Marca : '',
    Id_Persona :''
  }

  ejecutandose = false;

  ngOnInit() {
    document.getElementById('Codigo').focus();
  }
  keytab(event){
    if (event.key === 'Enter') {
      this.search();
    }
  }
  search(){
    if(this.ejecutandose){
      return false
    }
    this.ejecutandose = true;
    this.LeerInfoCodigo()
    return true;
  }
  async LeerInfoCodigo(){
    if(this.Marca.Codigo == ''){
      this.ejecutandose = false;
      return false;
    }
    let data = await this.marcasService.loadPersona(this.Marca.Codigo);
    if(data['total']== 0 ){
      this.ejecutandose = false;
      this.Marca.Codigo = '';
      Swal.fire('Codigo Erroneo');
      return false;
    }else{
      this.Marca.Nombre = data['data'][0]['Nombre'];
      this.Marca.Id_Persona = data['data'][0]['Id_Persona'];
      this.Marca.Fecha = new Date().toString();
      //Leer la ultima Marca de Hoy
      await this.LeerMarcas();
    }
    return true;
  }
  async LeerMarcas(){
    let data = await this.marcasService.leerMarcas(this.Marca.Id_Persona);
    if(data['total']==0){
      this.Marca.Marca = 'Entrada';
    }else{

      if(data['data'][0]['Marca'] == '1'){
        this.Marca.Marca = 'Salida';
      }else{
        this.Marca.Marca = 'Entrada';
      }
    }
    document.getElementById('Marcar').focus();
    this.ejecutandose =false;
  }
  async Marcar(){
    if(this.Marca.Codigo == ''){
      return false;
    }
    this.ejecutandose = true;
    let marca = 1;
    if(this.Marca.Marca == 'Entrada'){
      marca = 1;
    }else{
      marca = 2;
    }
    let data = await this.marcasService.Marcar(this.Marca.Id_Persona,marca);

    this.Marca = {
      Codigo : '',
      Nombre : '',
      Fecha : '',
      Marca : '',
      Id_Persona :''
    }
    //Swal.fire('Marca Registrada');
    this.ejecutandose = false;
    document.getElementById('Codigo').focus();
    return true;
  }
}
