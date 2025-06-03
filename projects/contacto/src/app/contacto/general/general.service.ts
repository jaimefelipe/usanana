import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

constructor(private apiService: ApiService) {}

  async leerNacionalidades(){
    let sqlConfig = {
        table: 'Gen_Nacionalidad',
        fields: 'Id_Nacionalidad, Nacionalidad',
        orderField: '',
        searchField: '',
        simple:true,
        Empresa: false
      };
      return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async leerPaises(){
    let pais = await this.apiService.obtenerPaises();
    return pais;
  }

}
