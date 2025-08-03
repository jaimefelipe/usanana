import { Component, OnInit , Input, SimpleChanges} from '@angular/core';
import { MensajesWhatsappService } from './mensajes-whatsapp.service';

@Component({
  selector: 'app-mensajes-whatsapp',
  templateUrl: './mensajes-whatsapp.component.html',
  styleUrls: ['./mensajes-whatsapp.component.css']
})
export class MensajesWhatsappComponent implements OnInit {

  @Input() IdPersona: string;
  @Input() NumeroWhatsApp: string;

  Mensajes: any[] = [];
  cargando = false;

  constructor(private mensajesService: MensajesWhatsappService) { }

  async ngOnInit() {
    //this.CargarMensajes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (changes['IdPersona'] && changes['IdPersona'].currentValue) {
        console.log('Leyendo mensajes');
        this.CargarMensajes();
    }
  }

  async CargarMensajes(){
     if (this.IdPersona) {
      this.cargando = true;
      const result = await this.mensajesService.loadMensajes(this.IdPersona);
      if (result.total > 0) {
        this.Mensajes = result.data;
      }else{
        this.Mensajes = [];
      }
      this.cargando = false;
    }
  }
}
