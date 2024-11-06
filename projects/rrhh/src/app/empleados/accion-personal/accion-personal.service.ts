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
      fields: 'Id_Accion_Personal,Rhh_Accion_Personal.Id_Persona,Fecha_Accion,Tipo_Accion,Rhh_Accion_Personal.Id_Puesto,Rhh_Accion_Personal.Id_Departamento,Salario,Rhh_Accion_Personal.Estado,Fecha_Inicio,Fecha_Fin,Gen_Persona.Nombre,Rhh_Puesto.Puesto,Rhh_Departamento.Departamento, PuestoAnterior.Puesto as Puesto_Anterior,DepartamentoAnterior.Departamento as Departamento_Anterior,Rhh_Empleado.Salario_Mes as Salario_Anterior,Rhh_Accion_Personal.Jornada,Rhh_Empleado.Jornada as Jornada_Old ,Rhh_Accion_Personal.Jornada,Rhh_Accion_Personal.Id_Roll,Rhh_Accion_Personal.Nombre_Roll,Rhh_Accion_Personal.Tipo_Contrato, Rhh_Empleado.Tipo_Contrato as Tipo_Contrato_Old,Rhh_Empleado.Fecha_Ingreso,Rhh_Empleado.Fecha_Salida',
      where: 'Id_Accion_Personal='+Id_Accion_Personal
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async grabarAccion(Accion){
    if(Accion.Id_Accion_Personal == ""){
    let sql = {
      table: 'Rhh_Accion_Personal',
      fields: 'Id_Persona,Fecha_Accion,Tipo_Accion,Id_Puesto,Id_Departamento,Salario,Estado,Fecha_Inicio,Fecha_Fin,Jornada,Id_Roll,Nombre_Roll',
      values: '\'' + Accion.Id_Persona
      + '\',\'' + Accion.Fecha_Accion
      + '\',\'' + Accion.Tipo_Accion
      + '\',\'' + Accion.Id_Puesto
      + '\',\'' + Accion.Id_Departamento
      + '\',\'' + Accion.Salario
      + '\',\'' + Accion.Estado
      + '\',\'' + Accion.Fecha_Inicio
      + '\',\'' + Accion.Fecha_Fin
      + '\',\'' + Accion.Jornada
      + '\',\'' + Accion.Id_Roll
      + '\',\'' + Accion.Nombre_Roll
      + '\',\'' + Accion.Tipo_Contrato
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
      + '\',Jornada=\''+ Accion.Jornada
      + '\',Id_Roll=\''+ Accion.Id_Roll
      + '\',Nombre_Roll=\''+ Accion.Nombre_Roll
      + '\',Tipo_Contrato=\''+ Accion.Tipo_Contrato
      + '\'',
      where: 'Id_Accion_Personal=' + Accion.Id_Accion_Personal
    };
    return await this.apiService.updateRecord(sql);
  }

  }

  async AplicarAccion(Accion){
    let sql = {
      table: 'Rhh_Empleado',
      fields: 'Id_Puesto=\'' + Accion.Id_Puesto
      + '\',Id_Puesto=\'' + Accion.Id_Puesto
      + '\',Id_Departamento=\'' + Accion.Id_Departamento
      + '\',Salario_Mes=\''+ Accion.Salario
      + '\',Estado=\''+ Accion.Estado
      + '\',Jornada=\''+ Accion.Tipo_Jornada
      + '\',Id_Roll=\''+ Accion.Id_Roll
      + '\',Nombre_Roll=\''+ Accion.Nombre_Roll
      + '\',Tipo_Contrato=\''+ Accion.Tipo_Contrato
      + '\'',
      where: 'Id_Persona=' + Accion.Id_Persona
    };
    return await this.apiService.updateRecord(sql);
  }
  async ActualizarFechaIngreso(Id_Persona,Fecha){
    let sql = {
      table: 'Rhh_Empleado',
      fields: 'Fecha_Ingreso=\''+ Fecha
      + '\'',
      where: 'Id_Persona=' + Id_Persona
    };
    return await this.apiService.updateRecord(sql);
  }
  async ActualizarFechaSalida(Id_Persona,Fecha){
    let sql = {
      table: 'Rhh_Empleado',
      fields: 'Fecha_Salida=\''+ Fecha
      + '\'',
      where: 'Id_Persona=' + Id_Persona
    };
    return await this.apiService.updateRecord(sql);
  }
  async actualizarEstado(Id_Persona,Estado){
    let sql = {
      table: 'Gen_Persona',
      fields: 'Estado=\'' +Estado
      + '\'',
      where: 'Id_Persona=' + Id_Persona
    };
    return await this.apiService.updateRecord(sql);
  }
  async actualizarEstadoAccion(Id_Accion_Personal){
    let sql = {
      table: 'Rhh_Accion_Personal',
      fields: 'Estado=\'' + 1
      + '\'',
      where: 'Id_Accion_Personal=' + Id_Accion_Personal
    };
    return await this.apiService.updateRecord(sql);
  }
}
