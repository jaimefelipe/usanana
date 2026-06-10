import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor(private apiService: ApiService) { }

  private q(value: any): string {
    const text = value === null || value === undefined ? '' : String(value);
    return "'" + text.replace(/'/g, "''") + "'";
  }

  async cargarCarreras(paginacion?,search?,Estado?) {
    let estado = '';
    if(Estado == 1 || Estado == 0){
      estado = 'Estado ='+ Estado;
    }
    let sqlConfig = {
      table: 'Edu_Carrera',
      fields: 'Id_Carrera,Codigo,Carrera,Nivel,Estado',
      searchField: search,
      paginacion: paginacion,
      where:estado
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarCarrera(Id_Carrera){
    let sqlConfig = {
      table: 'Edu_Carrera',
      fields: 'Id_Carrera,Codigo,Carrera,Descripcion,Requisito,Duracion,Nivel,Estado,Id_Facultad,Id_Escuela',
      where: 'Id_Carrera='+Id_Carrera
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async InsertarCarrera(Carrera){
    let sql = {
      table: 'Edu_Carrera',
      fields: 'Codigo,Carrera,Descripcion,Requisito,Duracion,Nivel,Estado,Id_Facultad,Id_Escuela',
      values: '\'' + Carrera.Codigo
      + '\',\'' + Carrera.Carrera
      + '\',\'' + Carrera.Descripcion
      + '\',\'' + Carrera.Requisito
      + '\',\'' + Carrera.Duracion
      + '\',\'' + Carrera.Nivel
      + '\',\'' + Carrera.Estado 
      + '\',\'' + Carrera.Id_Facultad
      + '\',\'' + Carrera.Id_Escuela
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async ActualizarCarrera(Carrera){
    let sql = {
      table: 'Edu_Carrera',
      fields: 'Codigo=\'' + Carrera.Codigo
      + '\',Carrera=\'' + Carrera.Carrera
      + '\',Descripcion=\'' + Carrera.Descripcion
      + '\',Requisito=\'' + Carrera.Requisito
      + '\',Duracion=\'' + Carrera.Duracion
      + '\',Nivel=\'' + Carrera.Nivel
      + '\',Estado=\''+ Carrera.Estado
      + '\',Id_Facultad=\'' + Carrera.Id_Facultad
      + '\',Id_Escuela=\'' + Carrera.Id_Escuela  
      + '\'',
      where: 'Id_Carrera=' + Carrera.Id_Carrera
    };
    return await this.apiService.updateRecord(sql);
  }

  async CargarCursosCarrera(Id_Carrera,paginacion,search?){

    let sqlConfig = {
      table: 'Edu_Curso_Carrera inner Join Edu_Curso on Edu_Curso_Carrera.Id_Curso = Edu_Curso.Id_Curso',
      fields: 'Id_Curso_Carrera,Edu_Curso_Carrera.Id_Curso,Bloque, Codigo, Curso',
      searchField: search,
      paginacion: paginacion,
      where:"Id_Carrera =" + Id_Carrera
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarCurso(Id_Curso){
    let sqlConfig = {
      table: 'Edu_Curso_Carrera inner Join Edu_Curso on Edu_Curso_Carrera.Id_Curso = Edu_Curso.Id_Curso',
      fields: 'Id_Curso_Carrera,Edu_Curso_Carrera.Id_Curso,Bloque, Codigo, Curso',
      where: 'Edu_Curso_Carrera.Id_Curso='+Id_Curso
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async cargarCursosDisponibles(paginacion,search?,Estado?) {
    let estado = ' Edu_Curso_Carrera.Id_curso IS NULL '
    if(Estado == 1 || Estado == 0){
      estado = ' and Estado ='+ Estado;
    }
    
    let sqlConfig = {
      table: 'Edu_Curso LEFT JOIN Edu_Curso_Carrera ON Edu_Curso.Id_Curso = Edu_Curso_Carrera.Id_Curso',
      fields: "Edu_Curso.Id_Curso,Codigo,Curso,'' as Id_Curso_Carrera",
      searchField: search,
      paginacion: paginacion,
      where:estado
    }

    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async InsertarCursoCarrera(Carrera){
    let sql = {
      table: 'Edu_Curso_Carrera',
      fields: 'Id_Carrera,Id_Curso,Bloque',
      values: '\'' + Carrera.Id_Carrera
      + '\',\'' + Carrera.Id_Curso
      + '\',\'' + Carrera.Bloque + '\''
    };
    return await this.apiService.insertRecord(sql);
  }

  async ActualizarCarreraCurso(Carrera){
    let sql = {
      table: 'Edu_Curso_Carrera',
      fields: 'Id_Curso=\'' + Carrera.Id_Curso
      + '\',Bloque=\''+ Carrera.Bloque  + '\'',
      where: 'Id_Curso_Carrera=' + Carrera.Id_Curso_Carrera
    };
    return await this.apiService.updateRecord(sql);
  }

  async leerCarrerasActivas(Id_Persona){
    let sqlConfig = {
      table: 'Edu_Carrera_Estudiante',
      fields: 'Id_Carrera',
      orderField: '',
      searchField: '',
      simple:true,
      where: 'Estado = 1 and Id_Persona = ' + Id_Persona,
      Empresa: false
    };

    return await this.apiService.executeSqlSyn(sqlConfig);
     //this.leerCursosMatriculados();
  }
  
  async asignarCarreraEstudiante(Id_Carrera,Id_Persona){
    let sql = {
      table: 'Edu_Carrera_Estudiante',
      fields: 'Id_Persona,Id_Carrera,Estado',
      values: '\'' + Id_Persona+ '\',\'' + Id_Carrera + '\',1'
    };
    return await this.apiService.insertRecord(sql);
  }

  async cargarConfigFinanciera(Id_Carrera) {
    const sqlConfig = {
      table: 'Edu_Admision_Config_Financiera',
      fields: 'Id_Config_Financiera,Id_Carrera,Nivel,Nombre,Moneda,Cursos_Por_Bloque,Creditos_Por_Curso,Precio_Credito,Precio_Curso,Matricula_Bloque,Medio_Pago_Texto,Bancos_JSON,Notificar_Email,Activo',
      where: 'Id_Empresa=' + (localStorage.getItem('Id_Empresa') || '1') + ' AND Id_Carrera=' + Id_Carrera + ' AND Activo=1',
      Empresa: false
    };
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async guardarConfigFinanciera(Carrera, ConfigFinanciera) {
    const empresa = localStorage.getItem('Id_Empresa') || '1';
    if (ConfigFinanciera.Id_Config_Financiera) {
      const sql = {
        table: 'Edu_Admision_Config_Financiera',
        fields: [
          'Nivel=' + this.q(Carrera.Nivel || ''),
          'Nombre=' + this.q(ConfigFinanciera.Nombre || ('Configuracion admision ' + Carrera.Carrera)),
          'Moneda=' + this.q(ConfigFinanciera.Moneda || 'CRC'),
          'Cursos_Por_Bloque=' + Number(ConfigFinanciera.Cursos_Por_Bloque || 4),
          'Creditos_Por_Curso=' + Number(ConfigFinanciera.Creditos_Por_Curso || 3),
          'Precio_Credito=' + Number(ConfigFinanciera.Precio_Credito || 0),
          'Precio_Curso=' + Number(ConfigFinanciera.Precio_Curso || 0),
          'Matricula_Bloque=' + Number(ConfigFinanciera.Matricula_Bloque || 0),
          'Medio_Pago_Texto=' + this.q(ConfigFinanciera.Medio_Pago_Texto || ''),
          'Bancos_JSON=' + this.q(ConfigFinanciera.Bancos_JSON || '[]'),
          'Notificar_Email=' + this.q(ConfigFinanciera.Notificar_Email || ''),
          'Modificado_El=NOW()',
          'Modificado_Por=' + this.q(localStorage.getItem('Nombre_Usuario') || '')
        ].join(','),
        where: 'Id_Empresa=' + empresa + ' AND Id_Config_Financiera=' + ConfigFinanciera.Id_Config_Financiera,
        Empresa: false
      };
      return await this.apiService.updateRecord(sql);
    }
    const sql = {
      table: 'Edu_Admision_Config_Financiera',
      fields: 'Id_Carrera,Nivel,Nombre,Moneda,Cursos_Por_Bloque,Creditos_Por_Curso,Precio_Credito,Precio_Curso,Matricula_Bloque,Medio_Pago_Texto,Bancos_JSON,Notificar_Email,Activo',
      values: [
        Carrera.Id_Carrera,
        this.q(Carrera.Nivel || ''),
        this.q(ConfigFinanciera.Nombre || ('Configuracion admision ' + Carrera.Carrera)),
        this.q(ConfigFinanciera.Moneda || 'CRC'),
        Number(ConfigFinanciera.Cursos_Por_Bloque || 4),
        Number(ConfigFinanciera.Creditos_Por_Curso || 3),
        Number(ConfigFinanciera.Precio_Credito || 0),
        Number(ConfigFinanciera.Precio_Curso || 0),
        Number(ConfigFinanciera.Matricula_Bloque || 0),
        this.q(ConfigFinanciera.Medio_Pago_Texto || ''),
        this.q(ConfigFinanciera.Bancos_JSON || '[]'),
        this.q(ConfigFinanciera.Notificar_Email || ''),
        1
      ].join(',')
    };
    return await this.apiService.insertRecord(sql);
  }
}
