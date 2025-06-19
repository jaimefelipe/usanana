import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';



@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css']
})
export class FullComponent implements OnInit {
  
  constructor(public router: Router) {}
  Empresa = localStorage.getItem("Empresa")
  User = localStorage.getItem('Nombre');
  accesosDirectos = [];
  resumenes = [];
  
  ngOnInit() {

    this.accesosDirectos = [
      { titulo: 'Empleados', link: '/empleados', icon: '/assets/empleados.png' },
      { titulo: 'Acción de Personal', link: '/accionpersonal', icon: '/assets/accion.png' },
      { titulo: 'Planillas', link: '/planilla', icon: '/assets/programacion.png' },
      { titulo: 'Reportes', link: '/reportesplanilla', icon: '/assets/reporte.png' }
    ];

    this.resumenes = [
      { valor: '35', label: 'Empleados Activos' },
      { valor: '12', label: 'Solicitudes en Proceso' },
      { valor: '5', label: 'Contratos por renovar' }
    ];
  }

}
