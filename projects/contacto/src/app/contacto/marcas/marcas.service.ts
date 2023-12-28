import { NodeWithI18n } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {

constructor(
  private apiService:ApiService
) { }

async loadPersona(Codigo){
  let sqlConfig = {
    table: 'Seg_Usuario Inner Join Gen_Persona on Seg_Usuario.Numero_Identificacion = Gen_Persona.Identificacion',
    fields: 'Gen_Persona.Id_Persona,Gen_Persona.Nombre',
    orderField: '',
    searchField: '',
    Empresa: false,
    where: "Salonero = " + Codigo + ' and Gen_Persona.Id_Empresa = ' + localStorage.getItem('Id_Empresa')
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}
async leerMarcas(Id_Persona){
  let sqlConfig = {
    table: 'Rhh_Marca',
    fields: 'Id_Marca,Marca',
    orderField: 'Creado_El',
    searchField: '',
    Distinct:false,
    where: "DATE(Creado_El) = CURDATE() and Id_Persona = " + Id_Persona
  }
  return await this.apiService.executeSqlSyn(sqlConfig);
}

async Marcar(Id_Persona,Marca){
  let sql = {
    table: 'Rhh_Marca',
    fields: 'Marca,Id_Persona,Fecha',
    values: '\'' + Marca
    + '\',\'' + Id_Persona
    + '\',NOW()'
  };
  return await this.apiService.insertRecord(sql);
}

}
