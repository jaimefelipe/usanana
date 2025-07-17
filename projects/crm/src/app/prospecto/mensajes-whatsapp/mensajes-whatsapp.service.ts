import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class MensajesWhatsappService {

constructor(private apiService:ApiService) { }

async loadMensajes(Id_Persona: string) {
    console.log('Leyendo mensaje')
    const sqlConfig = {
      table: 'Gen_Mensaje_WhatsApp',
      fields: 'Id_Mensaje_WhatsApp,Gen_Mensaje_WhatsApp.*',
      where: `Id_Persona = ${Id_Persona}`,
      order: 'FechaHora ASC'
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }


}
