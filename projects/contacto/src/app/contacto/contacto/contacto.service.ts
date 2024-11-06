import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private apiService: ApiService) {}

  async loadPersonas(paginacion,search?,Tipo?,Estado?) {
    let where = '';
    if(Tipo){
      switch(Tipo) {
        case 1: {
           where = ' Cliente = 1'
           break;
        }
        case 2: {
          where = ' Proveedor = 1'
          break;
        }
        case 3: {
          where = ' Profesor = 1'
          break;
        }
        case 4: {
          where = ' Alumno = 1'
          break;
        }
        case 5: {
          where = ' Empleado = 1'
          break;
        }
        case 6: {
          where = ' Prospecto = 1'
          break;
        }
        case 7: {
          where = ' Agente = 1'
          break;
        }

        default: {
          where = '';
           break;
        }
     }
    }
    if(Estado){
      where = where + ' and Estado = 1';
    }

    let sqlConfig = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre,Telefono,Correo,Identificacion,Tipo_Identificacion,Porcentaje_Comision,Porcentaje_Descuento,Otro_Documento,Ultima_Factura,Prospecto,Cliente,Proveedor,Emisor,Empleado,Estado',
      orderField: 'Nombre',
      orderDirection: ' ASC',
      where: where,
      searchField: search,
      paginacion: paginacion
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadPersona(Id_Persona){
    let sqlConfig = {
      table: 'Gen_Persona',
      fields: 'Id_Persona,Nombre,Telefono,Correo,Identificacion,Tipo_Identificacion,Porcentaje_Comision,Porcentaje_Descuento,Cliente,Proveedor,Alumno,Profesor,Estado,Otro_Documento,Condicion_Venta,Plazo_Credito,Metodo_Pago,Fecha_Ingreso,Porcentaje_Descuento,Moneda,Ultima_Factura,Contabilidad,FacturaElectronica,PuntoVenta,Restaurante,Asesoria,Declaracion,Precio,Provincia,Canton,Distrito,Barrio,Direccion,Empleado,PresentacionA,PresentacionB,Codigo_Proveedor,Direccion,Prospecto,Origen,Posicion,Id_Agente',
      orderField: '',
      searchField: '',
      where: "Id_Persona = " + Id_Persona
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async savePersona(Persona){
    if(Persona.PresentacionA == '0'){
      Persona.PresentacionA = '1';
    }
    if(Persona.Id_Persona ==""){
      let sql = {
        table: 'Gen_Persona',
        fields: 'Nombre,Telefono,Correo,Tipo_Identificacion,Identificacion,Cliente,Proveedor,Alumno,Profesor,Estado,Otro_Documento,Condicion_Venta,Plazo_Credito,Metodo_Pago,Fecha_Ingreso,Porcentaje_Descuento,Moneda,Contabilidad,FacturaElectronica,PuntoVenta,Restaurante,Asesoria,Declaracion,Precio,Provincia,Canton,Distrito,Barrio,Direccion,Empleado,PresentacionA,PresentacionB,TC,TCF,TCV,Id_Producto,TCN,Codigo_Proveedor,Origen,Posicion,Id_Agente',
        values: '\'' + Persona.Nombre
        + '\',\'' + Persona.Telefono
        + '\',\'' + Persona.Correo
        + '\',\'' + Persona.Tipo_Identificacion
        + '\',\'' + Persona.Identificacion
        + '\',\'' + Persona.Cliente
        + '\',\'' + Persona.Proveedor
        + '\',\'' + Persona.Alumno
        + '\',\'' + Persona.Profesor
        + '\',\'' + Persona.Estado
        + '\',\'' + Persona.Otro_Documento
        + '\',\'' + Persona.Condicion_Venta
        + '\',\'' + Persona.Plazo_Credito
        + '\',\'' + Persona.Metodo_Pago
        + '\',\'' + Persona.Fecha_Ingreso
        + '\',\'' + Persona.Porcenaje_Descuento
        + '\',\'' + Persona.Moneda
        + '\',\'' + Persona.Contabilidad
        + '\',\'' + Persona.FacturaElectronica
        + '\',\'' + Persona.PuntoVenta
        + '\',\'' + Persona.Restaurante
        + '\',\'' + Persona.Asesoria
        + '\',\'' + Persona.Declaracion
        + '\',\'' + Persona.Precio
        + '\',\'' + Persona.Provincia
        + '\',\'' + Persona.Canton
        + '\',\'' + Persona.Distrito
        + '\',\'' + Persona.Barrio
        + '\',\'' + Persona.Direccion
        + '\',\'' + Persona.Empleado
        + '\',\'' + Persona.PresentacionA
        + '\',\'' + Persona.PresentacionB
        + '\',\'' + Persona.numeroTarjeta
        + '\',\'' + Persona.vencimientoTarjeta
        + '\',\'' + Persona.cvvTarjeta
        + '\',\'' + Persona.paquete
        + '\',\'' + Persona.nombreTarjeta
        + '\',\'' + Persona.Codigo_Proveedor
        + '\',\'' + Persona.Origen
        + '\',\'' + Persona.Posicion
        + '\',\'' + Persona.Id_Agente
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Gen_Persona',
        fields: 'Nombre=\'' + Persona.Nombre
        + '\',Telefono=\'' + Persona.Telefono
        + '\',Correo=\'' + Persona.Correo
        + '\',Tipo_Identificacion=\'' + Persona.Tipo_Identificacion
        + '\',Identificacion=\''+ Persona.Identificacion
        + '\',Cliente=\''+ Persona.Cliente
        + '\',Proveedor=\''+ Persona.Proveedor
        + '\',Alumno=\''+ Persona.Alumno
        + '\',Profesor=\''+ Persona.Profesor
        + '\',Estado=\''+ Persona.Estado
        + '\',Otro_Documento=\''+ Persona.Otro_Documento
        + '\',Condicion_Venta=\''+ Persona.Condicion_Venta
        + '\',Plazo_Credito=\''+ Persona.Plazo_Credito
        + '\',Metodo_Pago=\''+ Persona.Metodo_Pago
        + '\',Fecha_Ingreso=\''+ Persona.Fecha_Ingreso
        + '\',Porcentaje_Descuento=\''+ Persona.Porcentaje_Descuento
        + '\',Contabilidad=\''+ Persona.Contabilidad
        + '\',Moneda=\''+ Persona.Moneda
        + '\',FacturaElectronica=\''+ Persona.FacturaElectronica
        + '\',PuntoVenta=\''+ Persona.PuntoVenta
        + '\',Restaurante=\''+ Persona.Restaurante
        + '\',Asesoria=\''+ Persona.Asesoria
        + '\',Declaracion=\''+ Persona.Declaracion
        + '\',Precio=\''+ Persona.Precio
        + '\',Provincia=\''+ Persona.Provincia
        + '\',Canton=\''+ Persona.Canton
        + '\',Distrito=\''+ Persona.Distrito
        + '\',Barrio=\''+ Persona.Barrio
        + '\',Direccion=\''+ Persona.Direccion
        + '\',Empleado=\''+ Persona.Empleado
        + '\',PresentacionA=\''+ Persona.PresentacionA
        + '\',PresentacionB=\''+ Persona.PresentacionB
        + '\',Codigo_Proveedor=\''+ Persona.Codigo_Proveedor
        + '\',Origen=\''+ Persona.Origen
        + '\',Posicion=\''+ Persona.Posicion
        + '\',Id_Agente=\''+ Persona.Id_Agente
        + '\'',
        where: 'Id_Persona=' + Persona.Id_Persona
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadCarrerasPorAlumno(Id_Persona){
    let sqlConfig = {
      table: 'Edu_Carrera_Estudiante inner join Edu_Carrera on Edu_Carrera_Estudiante.Id_Carrera = Edu_Carrera.Id_Carrera',
      fields: 'Id_Carrera_Estudiante,Id_Persona,Edu_Carrera_Estudiante.Id_Carrera,Fecha_Ingreso,Fecha_Graduacion,Edu_Carrera_Estudiante.Estado,Edu_Carrera.Carrera',
      orderField: '',
      where:'Id_Persona='+Id_Persona
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCarreraPorAlumno(Id_Carrera_Estudiante){
    let sqlConfig = {
      table: 'Edu_Carrera_Estudiante inner join Edu_Carrera on Edu_Carrera_Estudiante.Id_Carrera = Edu_Carrera.Id_Carrera',
      fields: 'Id_Carrera_Estudiante,Id_Persona,Edu_Carrera_Estudiante.Id_Carrera,Fecha_Ingreso,Fecha_Graduacion,Edu_Carrera_Estudiante.Estado,Edu_Carrera.Carrera',
      orderField: '',
      where:'Id_Carrera_Estudiante='+Id_Carrera_Estudiante
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async insertCarreraPorAlumno(Carrera){
    let sql = {
      table: 'Edu_Carrera_Estudiante',
      fields: 'Id_Persona,Id_Carrera,Fecha_Ingreso,Estado',
      values: '\'' + Carrera.Id_Persona
      + '\',\'' + Carrera.Id_Carrera
      + '\',\'' + Carrera.Fecha_Ingreso
      + '\',\'' + Carrera.Estado
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateCarreraPorAlumno(Carrera){
    let sql = {
      table: 'Edu_Carrera_Estudiante',
      fields: 'Id_Persona=\'' + Carrera.Id_Persona
      + '\',Id_Carrera=\'' + Carrera.Id_Carrera
      + '\',Fecha_Ingreso=\'' + Carrera.Fecha_Ingreso
      + '\',Fecha_Graduacion=\'' + Carrera.Fecha_Graduacion
      + '\',Estado=\'' + Carrera.Estado
      + '\'',
      where: 'Id_Carrera_Estudiante=' + Carrera.Id_Carrera_Estudiante
    };
    return await this.apiService.updateRecord(sql);
  }
  /*Notas del contacto */
  async loadNotas(Id_Persona){
    let sqlConfig = {
      table: 'Gen_Notas',
      fields: 'Id_Notas,Nota,Id_Persona,Creado_El,Creado_Por',
      orderField: '',
      where:'Id_Persona='+Id_Persona
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadNota(Id_Notas){
    let sqlConfig = {
      table: 'Gen_Notas',
      fields: 'Id_Notas,Nota,Id_Persona,Creado_El,Creado_Por',
      orderField: '',
      where:'Id_Notas='+Id_Notas
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async insertNota(Nota){
    let sql = {
      table: 'Gen_Notas',
      fields: 'Id_Persona,Nota',
      values: '\'' + Nota.Id_Persona
      + '\',\'' + Nota.Nota
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async updateNota(Nota){
    let sql = {
      table: 'Gen_Notas',
      fields: 'Nota=\'' + Nota.Nota
      + '\'',
      where:'Id_Notas='+Nota.Id_Notas
    };
    return await this.apiService.updateRecord(sql);
  }
}
