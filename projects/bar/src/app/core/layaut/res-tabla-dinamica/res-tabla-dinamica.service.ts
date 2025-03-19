import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ResTablaDinamicaService {

constructor(private apiService: ApiService) { 
  
  }
  async leerCuboVentas(){
    let sqlConfig = {
      table: 'Res_CuboVentas',
      fields: 'Anio,Mes,Categoria,Total_Ventas',
      orderField: '',
      simple:true,
      where: 'Id_Empresa = ' + localStorage.getItem('Id_Empresa')
    }
    return  await this.apiService.executeSqlSyn(sqlConfig);
  }
}
