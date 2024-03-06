import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CompanyService } from '../../../../../../main/src/app/general/company/company.service';
import {Router} from '@angular/router';
import { TransaccionesService } from '../transacciones/transacciones.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css']
})
export class FullComponent implements OnInit {
  hideMenu = true;
  MenuRestaurante = false;
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private companyService:CompanyService,
    private route:Router,
    private transaccionesService:TransaccionesService
  ) { }
  logedIn = false;
  hoy = new Date();
  diaSemana = this.hoy.getDay(); // Domingo es 0, Sábado es 6
  inicioSemana = new Date(this.hoy.setDate(this.hoy.getDate() - this.diaSemana)); // Fecha del domingo
  finSemana = new Date(this.hoy.setDate(this.hoy.getDate() + 6)); // Fecha del sábado
  
  inicioFormateado = formatDate(this.inicioSemana, 'd', 'en');
  finFormateado = formatDate(this.finSemana, 'd', 'en');
  totalTransacciones = 0;

  ngOnInit() {
    if(localStorage.getItem('isLoggedin') == "true") {
      this.logedIn = true;
    }else{
      this.route.navigate(['login']);
    }
    this.leerTotalTransacciones();
  }
  cerrarSesion(){
      localStorage.setItem('isLoggedin','false');
      localStorage.removeItem('Id_Empresa');
      localStorage.removeItem('Id_Usuario');
      localStorage.removeItem('Nombre_Usuario');
      localStorage.removeItem('Nombre');
      this.route.navigate(['login']);
  }
  facturar(){
    this.route.navigate(['facturar']);
  }
  consultarTransacciones(){
    this.route.navigate(['transacciones']);
  }
  async leerTotalTransacciones(){
    const fechaFormateada = this.calcularFecha(this.inicioSemana);
    const fechaFormateada1 = this.calcularFecha(this.finSemana);
    
    let data = await this.transaccionesService.leerTotalTransacciones(localStorage.getItem('Nombre_Usuario'),fechaFormateada + " 00:00:00",fechaFormateada1 + " 23:59:59");
    this.totalTransacciones = data['data'][0]['Total'];
  }
  calcularFecha(fecha){
    const mes = fecha.getMonth() + 1; // Sumamos 1 porque los meses van de 0 a 11
    const dia = fecha.getDate();
    const anio = fecha.getFullYear();
    // Formatear la fecha como 'MM/DD/YYYY'
    const fechaFormateada = `${anio}/${mes}/${dia}`;
    return fechaFormateada 
  }
}
