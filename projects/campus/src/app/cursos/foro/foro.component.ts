import { Component, OnInit, Input } from '@angular/core';
import { ForoService } from './foro.service';
import { titleSettings } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit {
  @Input() IdActividad!: number;
  foro: any;
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  Id_Persoa = '';
  constructor(
    private foroService:ForoService
  ) { }

   ngOnInit() {
    this.obtenerIdPersona();
    this.cargarForo();
  }

  async cargarForo() {
    let data = await this.foroService.obtenerForo(this.IdActividad);
    this.foro = data['data'][0];
    this.cargarMensajes();
  }

  async cargarMensajes() {
    let data = await this.foroService.obtenerMensajes(this.foro.Id_Foro);
    this.mensajes = data['data'];
    
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;
  
    const Mensaje = {
      Id_Foro: this.foro.Id_Foro,
      Id_Persona: this.Id_Persoa,
      Mensaje: this.nuevoMensaje
    };

    let data = this.foroService.enviarMensaje(Mensaje);
    this.nuevoMensaje = '';
    this.cargarMensajes();
  }
  async obtenerIdPersona(){
    let data = await this.foroService.obtenerIdPersona();
    this.Id_Persoa = data['data'][0]['Id_Persona'];
  }
}
