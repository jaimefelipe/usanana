import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paquete',
  templateUrl: './paquete.component.html',
  styleUrls: ['./paquete.component.css']
})
export class PaqueteComponent implements OnInit {

  constructor() { }

  edit = false;
  searchField ='';
  Paquetes = [];
  paginacion = {
    FirstRow: 1,
    LastRow: 50,
    TotalRows: 0
  };
  ngOnInit() {
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
    //this.loadTours();
  }
  search(){

  }
  keytab(e){

  }
  editRecord(paquete){

  }

}
