import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProySchedulerService {

  constructor(private apiService: ApiService) {}

  async leerActividades(Id_Proyecto?,Inicio?,Fin?){
    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: "Id_Proyecto, Id_Proyecto as id,Nombre as text,Inicio as start,Fin as end,Descripcion,Miembros,Estado",
      where:" Nivel = 7 and Inicio >='" + Inicio + "' and Fin <= '"+Fin + "'"
    }
    return await this.apiService.executeSqlSyn(sqlConfig);

  }
}
