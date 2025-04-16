import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TareasMainService {

constructor(
  private apiService:ApiService
) { }

async ObtenerIdPersona(Id_Usuario){
  let sqlConfig = {
    table: 'Gen_Persona',
    fields: 'Id_Persona,Nombre',
    where: "Gen_Persona.Id_Usuario ="+Id_Usuario
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}

}
