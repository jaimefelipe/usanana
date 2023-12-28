import { Component, OnInit } from '@angular/core';
import { PlanoService } from '../plano/plano.service';

@Component({
  selector: 'app-place-map',
  templateUrl: './place-map.component.html',
  styleUrls: ['./place-map.component.css']
})
export class PlaceMapComponent implements OnInit {

  constructor(
    private planoService:PlanoService
  ) { }

  Places = [];
  Id_Zona = '99';
  ngOnInit(): void {
    this.loadPlaces();
  }

  async loadPlaces(search?:any){
    //this.NombreEmpresa = localStorage.getItem('Empresa');
    let data = await this.planoService.loadPlaces(this.Id_Zona);
    if(data['total'] == 0){
      this.Places = [];
    }else{
      this.Places = data['data'];
    }
  }

}
