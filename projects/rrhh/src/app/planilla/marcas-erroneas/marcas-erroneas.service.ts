import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
@Injectable({
  providedIn: 'root'
})
export class MarcasErroneasService {

constructor(
  private apiService:ApiService
) { }

  async leerMarcas(Id_Planilla){
    return  await this.apiService.postRecord("Call sp_Verificar_Marcas_Incompletas(" + Id_Planilla +  ")" );
  }

 
}
