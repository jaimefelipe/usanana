import { Component, OnInit , Input} from '@angular/core';
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
    if (this.IdPersona) {
      this.cargando = true;
      const result = await this.mensajesService.loadMensajes(this.IdPersona);
      if (result.total > 0) {
        this.Mensajes = result.data;
      }
      this.cargando = false;
    }
  }
}
