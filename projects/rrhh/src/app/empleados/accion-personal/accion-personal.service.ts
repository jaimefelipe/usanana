import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class AccionPersonalService {

  constructor(private apiService: ApiService) {}

  async loadAcciones(paginacion:any,search?:any) {
    let sqlConfig = {
      table: 'Rhh_Accion_Personal inner Join Gen_Persona on Gen_Persona.Id_Persona = Rhh_Accion_Personal.Id_Persona inner Join Rhh_Puesto on Rhh_Puesto.Id_Puesto = Rhh_Accion_Personal.Id_Puesto inner Join Rhh_Departamento on Rhh_Departamento.Id_Departamento = Rhh_Accion_Personal.Id_Departamento',
      fields: 'Id_Accion_Personal,Rhh_Accion_Personal.Id_Persona,Fecha_Accion,Tipo_Accion,Rhh_Accion_Personal.Id_Puesto,Rhh_Accion_Personal.Id_Departamento,Salario,Rhh_Accion_Personal.Estado,Fecha_Inicio,Fecha_Fin,Gen_Persona.Nombre,Puesto,Rhh_Departamento.Departamento',
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async leerAccion(Id_Accion_Personal) {
    let sqlConfig = {
      table: 'Rhh_Accion_Personal inner Join Gen_Persona on Gen_Persona.Id_Persona = Rhh_Accion_Personal.Id_Persona inner Join Rhh_Puesto on Rhh_Puesto.Id_Puesto = Rhh_Accion_Personal.Id_Puesto inner Join Rhh_Departamento on Rhh_Departamento.Id_Departamento = Rhh_Accion_Personal.Id_Departamento left Join Rhh_Empleado on Rhh_Empleado.Id_Persona = Rhh_Accion_Personal.Id_Persona left Join Rhh_Puesto as PuestoAnterior on PuestoAnterior.Id_Puesto = Rhh_Empleado.Id_Puesto left Join Rhh_Departamento as DepartamentoAnterior on DepartamentoAnterior.Id_Departamento = Rhh_Empleado.Id_Departamento',
      fields: 'Id_Accion_Personal,Rhh_Accion_Personal.Id_Persona,Fecha_Accion,Tipo_Accion,Rhh_Accion_Personal.Id_Puesto,Rhh_Accion_Personal.Id_Departamento,Salario,Rhh_Accion_Personal.Estado,Fecha_Inicio,Fecha_Fin,Gen_Persona.Nombre,Rhh_Puesto.Puesto,Rhh_Departamento.Departamento, PuestoAnterior.Puesto as Puesto_Anterior,DepartamentoAnterior.Departamento as Departamento_Anterior,Rhh_Empleado.Salario_Mes as Salario_Anterior',
      where: 'Id_Accion_Personal='+Id_Accion_Personal
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async grabarAccion(Accion){
    if(Accion.Id_Accion_Personal == ""){
    let sql = {
      table: 'Rhh_Accion_Personal',
      fields: 'Id_Persona,Fecha_Accion,Tipo_Accion,Id_Puesto,Id_Departamento,Salario,Estado,Fecha_Inicio,Fecha_Fin',
      values: '\'' + Accion.Id_Persona
      + '\',\'' + Accion.Fecha_Accion
      + '\',\'' + Accion.Tipo_Accion
      + '\',\'' + Accion.Id_Puesto
      + '\',\'' + Accion.Id_Departamento
      + '\',\'' + Accion.Salario
      + '\',\'' + Accion.Estado
      + '\',\'' + Accion.Fecha_Inicio
      + '\',\'' + Accion.Fecha_Fin
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }else{
    let sql = {
      table: 'Rhh_Accion_Personal',
      fields: 'Id_Persona=\'' + Accion.Id_Persona
      + '\',Fecha_Accion=\'' + Accion.Fecha_Accion
      + '\',Tipo_Accion=\'' + Accion.Tipo_Accion
      + '\',Id_Puesto=\'' + Accion.Id_Puesto
      + '\',Id_Departamento=\'' + Accion.Id_Departamento
      + '\',Salario=\''+ Accion.Salario
      + '\',Estado=\''+ Accion.Estado
      + '\',Fecha_Inicio=\''+ Accion.Fecha_Inicio
      + '\',Fecha_Fin=\''+ Accion.Fecha_Fin
      + '\'',
      where: 'Id_Accion_Personal=' + Accion.Id_Accion_Personal
    };
    return await this.apiService.updateRecord(sql);
  }
}
}
