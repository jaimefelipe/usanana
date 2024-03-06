import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { formatDate } from '@angular/common';
import { TransaccionesService } from './transacciones.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css']
})
export class TransaccionesComponent implements OnInit {

  constructor(
    private route:Router,
    private transaccionesService:TransaccionesService
  ) { }
  hoy = new Date();
  diaSemana = this.hoy.getDay(); // Domingo es 0, Sábado es 6
  inicioSemana = new Date(this.hoy.setDate(this.hoy.getDate() - this.diaSemana)); // Fecha del domingo
  finSemana = new Date(this.hoy.setDate(this.hoy.getDate() + 6)); // Fecha del sábado

  inicioFormateado = formatDate(this.inicioSemana, 'd', 'en');
  finFormateado = formatDate(this.finSemana, 'd', 'en');

  transacciones = [];
  totalTransacciones= 0;

  ngOnInit() {
    this.leerTransacciones();
  }
  cerrarSesion(){
    localStorage.setItem('isLoggedin','false');
    localStorage.removeItem('Id_Empresa');
    localStorage.removeItem('Id_Usuario');
    localStorage.removeItem('Nombre_Usuario');
    localStorage.removeItem('Nombre');
    this.route.navigate(['login']);
  }
  atras(){
    this.route.navigate(['/']);
  }
  async leerTransacciones(){
    const fechaFormateada = this.calcularFecha(this.inicioSemana);
    const fechaFormateada1 = this.calcularFecha(this.finSemana);

    let data = await this.transaccionesService.leerTransacciones(localStorage.getItem('Nombre_Usuario'),fechaFormateada + " 00:00:00",fechaFormateada1 + " 23:59:59");
    if(data['success'] == 'true'){
      this.transacciones = data['data'];
      this.leerTotalTransacciones();
    }else{
      console.log('Error')
    }
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
