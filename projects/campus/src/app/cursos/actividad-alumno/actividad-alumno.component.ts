import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-actividad-alumno',
  templateUrl: './actividad-alumno.component.html',
  styleUrls: ['./actividad-alumno.component.css']
})
export class ActividadAlumnoComponent implements OnInit {
  @Input() actividad: any;
  @Input() IdPersona: number;
  archivoSeleccionado: File | null = null;

  constructor() { }

  ngOnInit() {
  }
  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }
  entregar() {
    if (!this.archivoSeleccionado) return alert("Debe seleccionar un archivo.");
    
    const formData = new FormData();
    formData.append('archivo', this.archivoSeleccionado);
    formData.append('IdActividad', this.actividad.Id_Actividad);
    formData.append('IdPersona', this.IdPersona.toString());
    /*
    this.servicio.entregarActividad(formData).subscribe(resp => {
      alert("Entrega realizada con éxito.");
    });
    */
  }

}
