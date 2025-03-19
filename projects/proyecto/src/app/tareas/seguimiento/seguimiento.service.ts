import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

constructor(private apiService: ApiService) {}
  async loadNotas(paginacion,search?,Estado?) {
    let sqlConfig = {
      table: 'Pro_Nota inner join Gen_Persona on Pro_Nota.Id_Persona = Gen_Persona.Id_Persona inner join Pro_Proyecto on Pro_Nota.Id_Proyecto = Pro_Proyecto.Id_Proyecto ',
      fields: 'Id_Nota,Pro_Nota.Id_Proyecto,Pro_Nota.Id_Persona,Gen_Persona.Nombre,Nota,Pro_Nota.Creado_El as Fecha, Pro_Proyecto.Nombre as Actividad',
      searchField: search,
      paginacion: paginacion,
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCentro(Id_Centro_Costo) {
    let sqlConfig = {
      table: 'Cge_Centro_Costo',
      fields: 'Id_Centro_Costo,Nombre',
      where: 'Id_Centro_Costo='+Id_Centro_Costo
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async saveCentro(Centro){
    if(Centro.Id_Centro_Costo == ""){
      let sql = {
        table: 'Cge_Centro_Costo',
        fields: 'Nombre',
        values: '\'' + Centro.Nombre
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Cge_Centro_Costo',
        fields: 'Nombre=\'' + Centro.Nombre
         + '\'',
        where: 'Id_Centro_Costo=' + Centro.Id_Centro_Costo
      };
      return await this.apiService.updateRecord(sql);
    }
  }

}
