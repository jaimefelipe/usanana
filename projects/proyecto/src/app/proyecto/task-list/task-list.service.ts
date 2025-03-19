import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  constructor(private apiService: ApiService) {}
  async leerProyectosHijos(Id_Proyecto?){
    let where = '';
    if(!Id_Proyecto){
      where = "Padre = ''";
    }else{
      where = "Padre = (SELECT Codigo FROM Pro_Proyecto WHERE Id_Proyecto = '" + Id_Proyecto + "')"
    }

    let sqlConfig = {
      table: 'Pro_Proyecto',
      fields: 'Id_Proyecto,Tipo,Nivel,Codigo,Padre,Nombre,Estado',
      where:where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  
  }

}
