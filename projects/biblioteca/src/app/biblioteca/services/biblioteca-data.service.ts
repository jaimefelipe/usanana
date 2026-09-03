import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';
import {
  Autor,
  Autoridad,
  AutoridadCampo,
  AutoridadSubcampo,
  AutoridadDicCampo,
  AutoridadDicFormato,
  AutoridadDicIndicador,
  AutoridadDicSubcampo,
  Categoria,
  CotizacionBiblioteca,
  Editorial,
  Ejemplar,
  FacturaCompraBiblioteca,
  IntegracionBiblioteca,
  Libro,
  LibroAutorSeleccionado,
  MarcCampo,
  MarcRegistro,
  MarcSubcampo,
  MarcDicFormato,
  MarcDicCampo,
  MarcDicSubcampo,
  MarcDicIndicador,
  Multa,
  OrdenCompraBiblioteca,
  OrdenCompraDetalleBiblioteca,
  OpacComentario,
  OpacEtiqueta,
  OpacHistorialBusqueda,
  OpacLista,
  OpacListaItem,
  PermisoBiblioteca,
  PoliticaPrestamo,
  Prestamo,
  PresupuestoBiblioteca,
  ProveedorBiblioteca,
  Reserva,
  RolBiblioteca,
  RolPermiso,
  SedeBiblioteca,
  Serial,
  SerialNumero,
  SerialRecepcion,
  SuscripcionSerial,
  Tesis,
  TipoMaterial,
  TipoMaterialMarcCampo,
  UsuarioBiblioteca,
  UsuarioRol
} from '../models/biblioteca.models';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaDataService {
  private libros: Libro[] = [
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', autores: 'Robert C. Martin', isbn: '978-0132350884', categoria: 'Ingenieria', tipoMaterial: 'Libro', estado: 'disponible' },
    { id: 2, titulo: 'El nombre del viento', autor: 'Patrick Rothfuss', autores: 'Patrick Rothfuss', isbn: '978-8499082479', categoria: 'Fantasia', tipoMaterial: 'Libro', estado: 'prestado' },
    { id: 3, titulo: 'Cien anos de soledad', autor: 'Gabriel Garcia Marquez', autores: 'Gabriel Garcia Marquez', isbn: '978-0307474728', categoria: 'Literatura', tipoMaterial: 'Libro', estado: 'reservado' },
    { id: 4, titulo: 'Domain-Driven Design', autor: 'Eric Evans', autores: 'Eric Evans', isbn: '978-0321125217', categoria: 'Ingenieria', tipoMaterial: 'Libro', estado: 'disponible' },
    { id: 5, titulo: 'Sapiens', autor: 'Yuval Noah Harari', autores: 'Yuval Noah Harari', isbn: '978-0062316097', categoria: 'Historia', tipoMaterial: 'Libro', estado: 'perdido' }
  ];

  private prestamos: Prestamo[] = [
    { id: 1, libroId: 1, usuario: 'Laura Rojas', fechaPrestamo: '2024-05-10', fechaVencimiento: '2024-05-24', renovaciones: 0, estado: 'activo' },
    { id: 2, libroId: 2, usuario: 'Carlos Mena', fechaPrestamo: '2024-05-01', fechaVencimiento: '2024-05-15', renovaciones: 1, estado: 'vencido' },
    { id: 3, libroId: 4, usuario: 'Ana Sols', fechaPrestamo: '2024-05-12', fechaVencimiento: '2024-05-26', renovaciones: 0, estado: 'activo' }
  ];

  private reservas: Reserva[] = [
    { id: 1, libroId: 3, usuario: 'Ana Ruiz', posicion: 1, estado: 'activa' },
    { id: 2, libroId: 5, usuario: 'Maria Soto', posicion: 1, estado: 'activa' }
  ];

  private usuarios: UsuarioBiblioteca[] = [
    { id: 1, nombre: 'Laura Rojas', bloqueado: false, prestamosActivos: 1, multasPendientes: 0 },
    { id: 2, nombre: 'Carlos Mena', bloqueado: true, prestamosActivos: 1, multasPendientes: 2 },
    { id: 3, nombre: 'Ana Sols', bloqueado: false, prestamosActivos: 1, multasPendientes: 0 },
    { id: 4, nombre: 'Maria Soto', bloqueado: false, prestamosActivos: 0, multasPendientes: 0 }
  ];

  constructor(private apiService: ApiService) {}

  private escapeSql(value?: string): string {
    return (value || '').replace(/'/g, "''");
  }

  /**
   * ISBN vacio debe ir como NULL: Bib_Libro tiene UNIQUE(Id_Empresa, ISBN) y
   * MySQL/MariaDB solo exime a NULL de esa restriccion (varios NULL son
   * validos, pero '' repetido dispara duplicate key en el segundo registro
   * sin ISBN de la misma empresa).
   */
  private sqlIsbn(value?: string): string {
    const trimmed = (value || '').trim();
    return trimmed ? `'${this.escapeSql(trimmed)}'` : 'NULL';
  }

  private getTagOrderField(tagField: string): string {
    return `CASE WHEN ${tagField} REGEXP '^[0-9]+$' THEN 0 ELSE 1 END, CAST(${tagField} AS UNSIGNED), ${tagField}`;
  }

  private getLibrosTable(): string {
    return 'Bib_Libro L ' +
      'LEFT JOIN Bib_Categoria C ON L.Categoria_Id = C.Id_Categoria ' +
      'LEFT JOIN Bib_Editorial E ON L.Editorial_Id = E.Id_Editorial ' +
      'LEFT JOIN Bib_Tipo_Material TM ON L.Id_Tipo_Material = TM.Id_Tipo_Material';
  }

  private getLibrosFields(): string {
    return `L.Id_Libro, L.Titulo, L.Subtitulo, L.ISBN, L.ISSN, L.DOI, L.Idioma, L.Anio_Publicacion,
      L.Edicion, L.Descripcion, L.Palabras_Clave, L.URL_Publica, L.Licencia, L.Categoria_Id, L.Editorial_Id, L.Id_Tipo_Material,
      C.Nombre AS Categoria, E.Nombre AS Editorial, TM.Nombre AS Tipo_Material,
      (SELECT MS245A.Valor
        FROM Bib_Marc_Registro MR245A
        INNER JOIN Bib_Marc_Campo MC245A ON MC245A.Marc_Registro_Id = MR245A.Id_Marc_Registro AND MC245A.Tag = '245'
        INNER JOIN Bib_Marc_Subcampo MS245A ON MS245A.Marc_Campo_Id = MC245A.Id_Marc_Campo AND MS245A.Codigo = 'a'
        WHERE MR245A.Libro_Id = L.Id_Libro
        ORDER BY MR245A.Id_Marc_Registro DESC, MC245A.Id_Marc_Campo DESC, MS245A.Id_Marc_Subcampo ASC
        LIMIT 1) AS Marc245A,
      (SELECT MS245B.Valor
        FROM Bib_Marc_Registro MR245B
        INNER JOIN Bib_Marc_Campo MC245B ON MC245B.Marc_Registro_Id = MR245B.Id_Marc_Registro AND MC245B.Tag = '245'
        INNER JOIN Bib_Marc_Subcampo MS245B ON MS245B.Marc_Campo_Id = MC245B.Id_Marc_Campo AND MS245B.Codigo = 'b'
        WHERE MR245B.Libro_Id = L.Id_Libro
        ORDER BY MR245B.Id_Marc_Registro DESC, MC245B.Id_Marc_Campo DESC, MS245B.Id_Marc_Subcampo ASC
        LIMIT 1) AS Marc245B,
      (SELECT MS245C.Valor
        FROM Bib_Marc_Registro MR245C
        INNER JOIN Bib_Marc_Campo MC245C ON MC245C.Marc_Registro_Id = MR245C.Id_Marc_Registro AND MC245C.Tag = '245'
        INNER JOIN Bib_Marc_Subcampo MS245C ON MS245C.Marc_Campo_Id = MC245C.Id_Marc_Campo AND MS245C.Codigo = 'c'
        WHERE MR245C.Libro_Id = L.Id_Libro
        ORDER BY MR245C.Id_Marc_Registro DESC, MC245C.Id_Marc_Campo DESC, MS245C.Id_Marc_Subcampo ASC
        LIMIT 1) AS Marc245C,
      (SELECT GROUP_CONCAT(A2.Nombre ORDER BY A2.Nombre SEPARATOR ', ')
        FROM Bib_Libro_Autor LA2
        INNER JOIN Bib_Autor A2 ON LA2.Autor_Id = A2.Id_Autor
        WHERE LA2.Libro_Id = L.Id_Libro) AS Autores,
      (SELECT CASE
          WHEN SUM(E2.Estado='disponible') > 0 THEN 'disponible'
          WHEN SUM(E2.Estado='reservado') > 0 THEN 'reservado'
          WHEN SUM(E2.Estado='prestado') > 0 THEN 'prestado'
          WHEN SUM(E2.Estado='perdido') > 0 THEN 'perdido'
          WHEN SUM(E2.Estado='mantenimiento') > 0 THEN 'mantenimiento'
          ELSE 'disponible'
        END
        FROM Bib_Ejemplar E2
        WHERE E2.Libro_Id = L.Id_Libro) AS Estado_Ejemplar,
      (SELECT E3.Imagen_Portada
        FROM Bib_Ejemplar E3
        WHERE E3.Libro_Id = L.Id_Libro AND E3.Imagen_Portada IS NOT NULL AND E3.Imagen_Portada <> ''
        ORDER BY E3.Id_Ejemplar ASC
        LIMIT 1) AS Imagen_Portada,
      (SELECT E4.URL_Archivo
        FROM Bib_Ejemplar E4
        WHERE E4.Libro_Id = L.Id_Libro AND E4.Tipo_Soporte = 'digital' AND E4.URL_Archivo IS NOT NULL AND E4.URL_Archivo <> ''
        ORDER BY E4.Id_Ejemplar ASC
        LIMIT 1) AS Url_Digital`;
  }

  private getLibrosWhere(search = ''): string {
    const text = this.escapeSql(search.trim());
    if (!text) {
      return '';
    }
    return `(L.Titulo LIKE '%${text}%' ` +
      `OR L.ISBN LIKE '%${text}%' ` +
      `OR L.ISSN LIKE '%${text}%' ` +
      `OR C.Nombre LIKE '%${text}%' ` +
      `OR E.Nombre LIKE '%${text}%' ` +
      `OR TM.Nombre LIKE '%${text}%' ` +
      `OR EXISTS (` +
      `SELECT 1 FROM Bib_Marc_Registro MR245S ` +
      `INNER JOIN Bib_Marc_Campo MC245S ON MC245S.Marc_Registro_Id = MR245S.Id_Marc_Registro AND MC245S.Tag = '245' ` +
      `INNER JOIN Bib_Marc_Subcampo MS245S ON MS245S.Marc_Campo_Id = MC245S.Id_Marc_Campo AND MS245S.Codigo IN ('a','b','c') ` +
      `WHERE MR245S.Libro_Id = L.Id_Libro ` +
      `AND CONVERT(MS245S.Valor USING utf8mb4) COLLATE utf8mb4_unicode_ci LIKE '%${text}%'` +
      `) ` +
      `OR EXISTS (` +
      `SELECT 1 FROM Bib_Libro_Autor LA3 ` +
      `INNER JOIN Bib_Autor A3 ON LA3.Autor_Id = A3.Id_Autor ` +
      `WHERE LA3.Libro_Id = L.Id_Libro AND A3.Nombre LIKE '%${text}%'` +
      `))`;
  }

  private mapLibroRow(row: any): Libro {
    return {
      id: Number(row.Id_Libro),
      titulo: row.Marc245A || row.Titulo,
      subtitulo: row.Marc245B || row.Subtitulo || '',
      autor: row.Marc245C || row.Autores || 'Sin autor',
      autores: row.Autores || '',
      marc245a: row.Marc245A || '',
      marc245b: row.Marc245B || '',
      marc245c: row.Marc245C || '',
      isbn: row.ISBN || '',
      issn: row.ISSN || '',
      doi: row.DOI || '',
      categoria: row.Categoria || 'Sin categoria',
      editorial: row.Editorial || 'Sin editorial',
      tipoMaterial: row.Tipo_Material || 'Sin tipo',
      estado: row.Estado_Ejemplar || 'disponible',
      idioma: row.Idioma || '',
      anioPublicacion: row.Anio_Publicacion ? Number(row.Anio_Publicacion) : undefined,
      edicion: row.Edicion || '',
      descripcion: row.Descripcion || '',
      palabrasClave: row.Palabras_Clave || '',
      urlPublica: row.URL_Publica || '',
      licencia: row.Licencia || '',
      imagenPortada: row.Imagen_Portada || '',
      urlDigital: row.Url_Digital || '',
      categoriaId: row.Categoria_Id ? Number(row.Categoria_Id) : undefined,
      editorialId: row.Editorial_Id ? Number(row.Editorial_Id) : undefined,
      tipoMaterialId: row.Id_Tipo_Material ? Number(row.Id_Tipo_Material) : undefined
    };
  }

  async getLibros(): Promise<Libro[]> {
    try {
      const sqlConfig = {
        table: this.getLibrosTable(),
        fields: this.getLibrosFields(),
        orderField: 'L.Titulo',
        orderDirection: ' ASC ',
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => this.mapLibroRow(row));
      }
      return [];
    } catch (error) {
      console.error(error);
      return this.libros;
    }
  }

  async getLibrosPage(page = 1, pageSize = 50, search = ''): Promise<{ libros: Libro[]; total: number }> {
    try {
      const total = await this.countLibros(search);
      if (total === 0) {
        return { libros: [], total };
      }
      const sqlConfig = {
        table: this.getLibrosTable(),
        fields: this.getLibrosFields(),
        where: this.getLibrosWhere(search),
        orderField: 'L.Id_Libro',
        orderDirection: ' DESC ',
        Empresa: false,
        paginacion: {
          FirstRow: (Math.max(1, page) - 1) * pageSize + 1,
          LastRow: Math.max(1, page) * pageSize,
          TotalRows: 0
        }
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      const libros = data && data['data'] ? data['data'].map((row: any) => this.mapLibroRow(row)) : [];
      return { libros, total };
    } catch (error) {
      console.error(error);
      const searchLower = search.trim().toLowerCase();
      const fallback = searchLower
        ? this.libros.filter(libro =>
            [libro.titulo, libro.autor, libro.autores, libro.isbn, libro.categoria, libro.tipoMaterial]
              .some(value => String(value || '').toLowerCase().includes(searchLower))
          )
        : this.libros;
      const start = (Math.max(1, page) - 1) * pageSize;
      return {
        libros: fallback.slice(start, start + pageSize),
        total: fallback.length
      };
    }
  }

  async countLibros(search = ''): Promise<number> {
    try {
      const sqlConfig = {
        table: this.getLibrosTable(),
        fields: 'COUNT(*) AS total',
        where: this.getLibrosWhere(search),
        simple: true,
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return Number(data['data'][0].total || 0);
      }
      return 0;
    } catch (error) {
      console.error(error);
      return this.libros.length;
    }
  }

  async getLibroById(id: number): Promise<Libro | undefined> {
    try {
      const sqlConfig = {
        table: this.getLibrosTable(),
        fields: this.getLibrosFields(),
        where: `L.Id_Libro=${Number(id)}`,
        orderField: 'L.Id_Libro',
        orderDirection: ' DESC ',
        simple: true,
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return this.mapLibroRow(data['data'][0]);
      }
      return undefined;
    } catch (error) {
      console.error(error);
      return this.libros.find(libro => libro.id === id);
    }
  }

  async getAutoresPorLibro(libroId: number): Promise<LibroAutorSeleccionado[]> {
    const sqlConfig = {
      table: 'Bib_Libro_Autor LA INNER JOIN Bib_Autor A ON A.Id_Autor = LA.Autor_Id',
      fields: 'LA.Autor_Id, A.Nombre, LA.Rol',
      where: 'LA.Libro_Id=' + libroId,
      orderField: 'A.Nombre',
      orderDirection: ' ASC ',
      Empresa: false
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return data['data'].map((row: any) => ({
        id: Number(row.Autor_Id),
        nombre: row.Nombre,
        rol: row.Rol || 'Autor'
      }));
    }
    return [];
  }

  async saveLibroAutores(libroId: number, autores: LibroAutorSeleccionado[]): Promise<void> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    await this.apiService.postRecord(
      `DELETE FROM Bib_Libro_Autor WHERE Libro_Id=${libroId} AND Id_Empresa=${empresaId}`
    );

    if (!autores || autores.length === 0) return;

    for (const autor of autores) {
      const sql = {
        table: 'Bib_Libro_Autor',
        fields: 'Libro_Id,Autor_Id,Rol',
        values: `${libroId},${autor.id},'${this.escapeSql(autor.rol)}'`
      };
      await this.apiService.insertRecord(sql);
    }
  }

  async buscarAutores(texto: string): Promise<Autor[]> {
    const termino = this.escapeSql(texto.trim());
    if (!termino) return [];
    const sqlConfig = {
      table: 'Bib_Autor',
      fields: 'Id_Autor, Nombre, Nacionalidad, Fecha_Nacimiento',
      where: `Nombre LIKE '%${termino}%'`,
      orderField: 'Nombre',
      orderDirection: ' ASC ',
      Empresa: true,
      paginacion: { FirstRow: 1, LastRow: 10, TotalRows: 0 }
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return data['data'].map((row: any) => ({
        id: Number(row.Id_Autor),
        nombre: row.Nombre,
        nacionalidad: row.Nacionalidad || '',
        fechaNacimiento: row.Fecha_Nacimiento || ''
      }));
    }
    return [];
  }

  async createLibro(libro: Libro): Promise<number | null> {
    const sql = {
      table: 'Bib_Libro',
      fields: 'Titulo,Subtitulo,ISBN,ISSN,DOI,Editorial_Id,Categoria_Id,Id_Tipo_Material,Idioma,Anio_Publicacion,Edicion,Descripcion,Palabras_Clave,URL_Publica,Licencia',
      values: `'${this.escapeSql(libro.titulo)}','${this.escapeSql(libro.subtitulo)}',${this.sqlIsbn(libro.isbn)},` +
        `'${this.escapeSql(libro.issn)}','${this.escapeSql(libro.doi)}',` +
        `${libro.editorialId || 'NULL'},${libro.categoriaId || 'NULL'},${libro.tipoMaterialId || 'NULL'},` +
        `'${this.escapeSql(libro.idioma)}',${libro.anioPublicacion || 'NULL'},` +
        `'${this.escapeSql(libro.edicion)}','${this.escapeSql(libro.descripcion)}',` +
        `'${this.escapeSql(libro.palabrasClave)}','${this.escapeSql(libro.urlPublica)}',` +
        `'${this.escapeSql(libro.licencia)}'`
    };
    const data = await this.apiService.insertRecord(sql);
    const insertId = this.extractInsertId(data);
    if (insertId) return insertId;
    return await this.resolveLibroId(libro);
  }

  async updateLibro(libro: Libro): Promise<any> {
    const sql = {
      table: 'Bib_Libro',
      fields: `Titulo='${this.escapeSql(libro.titulo)}',Subtitulo='${this.escapeSql(libro.subtitulo)}',` +
        `ISBN=${this.sqlIsbn(libro.isbn)},ISSN='${this.escapeSql(libro.issn)}',DOI='${this.escapeSql(libro.doi)}',` +
        `Editorial_Id=${libro.editorialId || 'NULL'},Categoria_Id=${libro.categoriaId || 'NULL'},` +
        `Id_Tipo_Material=${libro.tipoMaterialId || 'NULL'},` +
        `Idioma='${this.escapeSql(libro.idioma)}',Anio_Publicacion=${libro.anioPublicacion || 'NULL'},` +
        `Edicion='${this.escapeSql(libro.edicion)}',Descripcion='${this.escapeSql(libro.descripcion)}',` +
        `Palabras_Clave='${this.escapeSql(libro.palabrasClave)}',URL_Publica='${this.escapeSql(libro.urlPublica)}',` +
        `Licencia='${this.escapeSql(libro.licencia)}'`,
      where: 'Id_Libro=' + libro.id
    };
    return await this.apiService.updateRecord(sql);
  }

  private async resolveLibroId(libro: Libro): Promise<number | null> {
    const where = libro.isbn
      ? `ISBN='${this.escapeSql(libro.isbn)}'`
      : `Titulo='${this.escapeSql(libro.titulo)}'`;
    const sqlConfig = {
      table: 'Bib_Libro',
      fields: 'Id_Libro',
      where,
      orderField: 'Id_Libro',
      orderDirection: ' DESC ',
      Empresa: true
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return Number(data['data'][0]['Id_Libro']);
    }
    return null;
  }

  private extractInsertId(response: any): number | null {
    if (!response) return null;
    const candidate = response['Identity'] || response['insertId'] || response?.data?.Identity || response?.data?.insertId;
    return candidate ? Number(candidate) : null;
  }

  private ensureSqlSuccess(response: any, context: string) {
    const success = response?.success;
    const ok = success === true || success === 'true' || success === 1 || success === '1';
    if (ok) {
      return response;
    }
    const detail = response?.error || response?.Error || response?.message || '';
    const sql = response?.sql ? ` SQL: ${response.sql}` : '';
    throw new Error(`${context}${detail ? `: ${detail}` : ''}${sql}`);
  }

  private getEmpresaId(): number {
    return Number(localStorage.getItem('Id_Empresa') || 1);
  }

  private getNombreUsuarioActual(): string {
    return localStorage.getItem('Nombre_Usuario') || 'Sistema';
  }

  private getFirstDataRow(response: any): any {
    if (Array.isArray(response?.data) && response.data.length > 0) {
      return response.data[0];
    }
    if (Array.isArray(response) && response.length > 0) {
      return response[0];
    }
    return null;
  }

  private getResponseTotal(response: any, field = 'Total'): number {
    const row = this.getFirstDataRow(response);
    return Number(row?.[field] ?? row?.[field.toLowerCase()] ?? 0);
  }

  private fechaVencida(fecha?: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fecha);
    vencimiento.setHours(0, 0, 0, 0);
    return vencimiento.getTime() < hoy.getTime();
  }

  private estadoPrestamoEfectivo(estado: string, fechaVencimiento?: string, fechaDevolucion?: string): Prestamo['estado'] {
    const estadoNormalizado = String(estado || '').trim().toLowerCase();
    if (fechaDevolucion || ['devuelto', 'cancelado', 'perdido'].includes(estadoNormalizado)) {
      return estadoNormalizado as Prestamo['estado'];
    }
    if (['activo', 'pendiente'].includes(estadoNormalizado) && this.fechaVencida(fechaVencimiento)) {
      return 'vencido';
    }
    return (estadoNormalizado || 'activo') as Prestamo['estado'];
  }

  private async getPoliticaCirculacion(): Promise<{ diasPrestamo: number; maxPrestamos: number; maxReservas: number }> {
    const politicas = await this.getPoliticasPrestamo();
    const politica = politicas[0];
    if (politica) {
      return {
        diasPrestamo: Number(politica.diasPrestamo || 7),
        maxPrestamos: Number(politica.maxPrestamos || 2),
        maxReservas: Number(politica.maxReservas ?? politica.maxPrestamos ?? 2)
      };
    }

    try {
      const tipoMaterialId = await this.getDefaultTipoMaterialId();
      if (!tipoMaterialId) {
        return { diasPrestamo: 7, maxPrestamos: 2, maxReservas: 2 };
      }
      await this.createPoliticaPrestamo({
        id: 0,
        tipoUsuario: 'General',
        tipoMaterialId,
        diasPrestamo: 7,
        maxRenovaciones: 0,
        maxPrestamos: 2,
        maxReservas: 2,
        multaDiaria: 0
      });
    } catch (error) {
      console.error(error);
    }

    return { diasPrestamo: 7, maxPrestamos: 2, maxReservas: 2 };
  }

  private async getDefaultTipoMaterialId(): Promise<number | null> {
    try {
      const data = await this.apiService.executeSqlSyn({
        table: 'Bib_Tipo_Material',
        fields: 'Id_Tipo_Material',
        orderField: 'Id_Tipo_Material',
        orderDirection: ' ASC ',
        simple: true,
        Empresa: true
      });
      if (data && data['total'] > 0) {
        return Number(data['data'][0]['Id_Tipo_Material']);
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async usuarioPuedeSolicitar(usuarioId: number): Promise<{ ok: boolean; motivo?: string }> {
    const usuario = (await this.getUsuarios()).find(item => item.id === usuarioId);
    if (!usuario) {
      return { ok: false, motivo: 'Usuario no encontrado' };
    }
    if (usuario.bloqueado) {
      return { ok: false, motivo: 'El usuario no esta activo para solicitar recursos' };
    }
    if (Number(usuario.multasPendientes || 0) > 0 || Number(usuario.multaAcumulada || 0) > 0) {
      return { ok: false, motivo: 'El usuario tiene sanciones pendientes' };
    }

    try {
      const data = await this.apiService.executeSqlSyn({
        table: 'Bib_Bloqueo_Usuario',
        fields: 'COUNT(*) AS Total',
        where: `Usuario_Id=${usuarioId} AND Estado='Activo'`,
        simple: true,
        Empresa: true
      });
      if (this.getResponseTotal(data) > 0) {
        return { ok: false, motivo: 'El usuario tiene una sancion activa' };
      }
    } catch (error) {
      console.error(error);
    }

    return { ok: true };
  }

  private async contarCirculacionActiva(usuarioId: number): Promise<number> {
    const empresaId = this.getEmpresaId();
    const data = await this.apiService.postRecord(
      `SELECT ` +
      `(SELECT COUNT(*) FROM Bib_Prestamo ` +
      `WHERE Usuario_Id=${usuarioId} AND Id_Empresa=${empresaId} ` +
      `AND Estado IN ('activo','Activo','pendiente','Pendiente')) + ` +
      `(SELECT COUNT(*) FROM Bib_Reserva ` +
      `WHERE Usuario_Id=${usuarioId} AND Id_Empresa=${empresaId} ` +
      `AND Estado IN ('activa','Activa','En espera','Disponible','disponible')) AS Total`
    );
    return this.getResponseTotal(data);
  }

  private getEstadosReservaBloqueantesSql(alias = ''): string {
    const prefix = alias ? `${alias}.` : '';
    return `LOWER(${prefix}Estado) IN ('activa','en espera','disponible')`;
  }

  private async getLibroIdPrestamo(prestamoId: number): Promise<number> {
    const empresaId = this.getEmpresaId();
    const data = await this.apiService.postRecord(
      `SELECT E.Libro_Id ` +
      `FROM Bib_Prestamo P ` +
      `INNER JOIN Bib_Ejemplar E ON E.Id_Ejemplar=P.Ejemplar_Id AND E.Id_Empresa=P.Id_Empresa ` +
      `WHERE P.Id_Prestamo=${prestamoId} AND P.Id_Empresa=${empresaId} LIMIT 1`
    );
    const row = this.getFirstDataRow(data);
    return Number(row?.Libro_Id || 0);
  }

  async contarReservasBloqueantesLibro(libroId: number): Promise<number> {
    const empresaId = this.getEmpresaId();
    const data = await this.apiService.postRecord(
      `SELECT COUNT(*) AS Total ` +
      `FROM Bib_Reserva R ` +
      `WHERE R.Libro_Id=${libroId} AND R.Id_Empresa=${empresaId} ` +
      `AND ${this.getEstadosReservaBloqueantesSql('R')}`
    );
    return this.getResponseTotal(data);
  }

  async validarSolicitudCirculacion(usuarioId: number): Promise<{ ok: boolean; motivo?: string; total: number; limite: number }> {
    const puedeSolicitar = await this.usuarioPuedeSolicitar(usuarioId);
    const politica = await this.getPoliticaCirculacion();
    const limite = Math.max(1, Number(politica.maxPrestamos || 2));

    if (!puedeSolicitar.ok) {
      return { ...puedeSolicitar, total: 0, limite };
    }

    const total = await this.contarCirculacionActiva(usuarioId);
    if (total >= limite) {
      return {
        ok: false,
        total,
        limite,
        motivo: `Este usuario ya tiene ${total} prestamo(s)/reserva(s) activos. El maximo permitido es ${limite}.`
      };
    }

    return { ok: true, total, limite };
  }

  private async resolveMarcRegistroSummary(libroId: number, formato: string): Promise<{ id: number; control001: string } | null> {
    const sqlConfig = {
      table: 'Bib_Marc_Registro',
      fields: 'Id_Marc_Registro, Control_001',
      where: `Libro_Id=${libroId} AND Formato='${this.escapeSql(formato)}'`,
      orderField: 'Id_Marc_Registro',
      orderDirection: ' DESC ',
      Empresa: true
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return {
        id: Number(data['data'][0]['Id_Marc_Registro']),
        control001: data['data'][0]['Control_001'] || ''
      };
    }
    return null;
  }

  private async resolveMarcRegistroControl001ById(id: number): Promise<string> {
    const sqlConfig = {
      table: 'Bib_Marc_Registro',
      fields: 'Control_001',
      where: `Id_Marc_Registro=${id}`,
      orderField: 'Id_Marc_Registro',
      orderDirection: ' DESC ',
      Empresa: true
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return data['data'][0]['Control_001'] || '';
    }
    return '';
  }

  private async callMarcProcedure(sql: string, context: string) {
    const response = await this.apiService.postRecord(sql);
    return this.ensureSqlSuccess(response, context);
  }

  async ensureMarcRegistroControl001(item: MarcRegistro): Promise<string> {
    let control001 = item.control001 || await this.resolveMarcRegistroControl001ById(item.id);
    if (!control001 && item.id) {
      const sql = `CALL sp_Bib_Asegurar_Marc_Control001(${item.id}, ${this.getEmpresaId()});`;
      const response = await this.callMarcProcedure(sql, 'Error SQL al asignar el consecutivo MARC 001');
      const row = this.getFirstDataRow(response);
      control001 = row?.Control_001 || row?.control001 || '';
    }
    if (!control001) {
      throw new Error('No se pudo asignar el consecutivo MARC 001');
    }
    return control001;
  }

  private async resolveMarcRegistroId(libroId: number, formato: string): Promise<number | null> {
    const sqlConfig = {
      table: 'Bib_Marc_Registro',
      fields: 'Id_Marc_Registro',
      where: `Libro_Id=${libroId} AND Formato='${this.escapeSql(formato)}'`,
      orderField: 'Id_Marc_Registro',
      orderDirection: ' DESC ',
      Empresa: true
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return Number(data['data'][0]['Id_Marc_Registro']);
    }
    return null;
  }

  private async resolveMarcCampoId(marcRegistroId: number, tag: string, ind1: string, ind2: string, valor: string): Promise<number | null> {
    const clauses = [
      `Marc_Registro_Id=${marcRegistroId}`,
      `Tag='${this.escapeSql(tag)}'`,
      `Ind1='${this.escapeSql(ind1)}'`,
      `Ind2='${this.escapeSql(ind2)}'`
    ];
    if (valor) {
      clauses.push(`Valor='${this.escapeSql(valor)}'`);
    } else {
      clauses.push('(Valor IS NULL OR Valor = \'\')');
    }
    const sqlConfig = {
      table: 'Bib_Marc_Campo',
      fields: 'Id_Marc_Campo',
      where: clauses.join(' AND '),
      orderField: 'Id_Marc_Campo',
      orderDirection: ' DESC ',
      Empresa: true
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return Number(data['data'][0]['Id_Marc_Campo']);
    }
    return null;
  }

  private async resolveMarcSubcampoId(marcCampoId: number, codigo: string, valor: string): Promise<number | null> {
    const clauses = [
      `Marc_Campo_Id=${marcCampoId}`,
      `Codigo='${this.escapeSql(codigo)}'`
    ];
    if (valor) {
      clauses.push(`Valor='${this.escapeSql(valor)}'`);
    } else {
      clauses.push("(Valor IS NULL OR Valor = '')");
    }
    const sqlConfig = {
      table: 'Bib_Marc_Subcampo',
      fields: 'Id_Marc_Subcampo',
      where: clauses.join(' AND '),
      orderField: 'Id_Marc_Subcampo',
      orderDirection: ' DESC ',
      Empresa: true
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return Number(data['data'][0]['Id_Marc_Subcampo']);
    }
    return null;
  }

  async getPrestamos(): Promise<Prestamo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Prestamo P INNER JOIN Bib_Ejemplar E ON P.Ejemplar_Id = E.Id_Ejemplar INNER JOIN Seg_Usuario U ON P.Usuario_Id = U.Id_Usuario',
        fields: 'P.Id_Prestamo, P.Ejemplar_Id, E.Libro_Id, P.Usuario_Id, U.Nombre AS Usuario, P.Fecha_Prestamo, P.Fecha_Vencimiento, P.Fecha_Devolucion, P.Renovaciones, P.Estado, P.Observaciones',
        orderField: 'P.Fecha_Prestamo',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Prestamo),
          ejemplarId: Number(row.Ejemplar_Id),
          libroId: Number(row.Libro_Id),
          usuario: row.Usuario,
          usuarioId: Number(row.Usuario_Id),
          fechaPrestamo: row.Fecha_Prestamo,
          fechaVencimiento: row.Fecha_Vencimiento,
          fechaDevolucion: row.Fecha_Devolucion,
          renovaciones: Number(row.Renovaciones),
          estado: this.estadoPrestamoEfectivo(row.Estado, row.Fecha_Vencimiento, row.Fecha_Devolucion),
          observaciones: row.Observaciones || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return this.prestamos;
    }
  }

  async getReservas(): Promise<Reserva[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Reserva R INNER JOIN Seg_Usuario U ON R.Usuario_Id = U.Id_Usuario',
        fields: 'R.Id_Reserva, R.Libro_Id, R.Usuario_Id, U.Nombre AS Usuario, R.Posicion, R.Estado, R.Fecha_Reserva, R.Fecha_Asignacion',
        orderField: 'R.Fecha_Reserva',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Reserva),
          libroId: Number(row.Libro_Id),
          usuarioId: Number(row.Usuario_Id),
          usuario: row.Usuario,
          posicion: Number(row.Posicion),
          estado: row.Estado,
          fechaReserva: row.Fecha_Reserva,
          fechaAsignacion: row.Fecha_Asignacion
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return this.reservas;
    }
  }

  async getUsuarios(): Promise<UsuarioBiblioteca[]> {
    try {
      const empresaId = this.getEmpresaId();
      const sqlConfig = {
        table: 'Seg_Usuario_Empresa UE INNER JOIN Seg_Usuario U ON UE.Id_Usuario = U.Id_Usuario',
        fields: `U.Id_Usuario, U.Nombre, U.Correo, U.Telefono, U.Numero_Identificacion, U.Tipo_Usuario, U.Estado,
          (SELECT COUNT(*) FROM Bib_Prestamo P WHERE P.Id_Empresa=${empresaId} AND P.Usuario_Id=U.Id_Usuario AND P.Estado IN ('activo','Activo','pendiente','Pendiente')) AS Prestamos_Activos,
          (SELECT COALESCE(SUM(M.Saldo),0) FROM Bib_Multa M WHERE M.Id_Empresa=${empresaId} AND M.Usuario_Id=U.Id_Usuario AND M.Estado IN ('pendiente','Pendiente','activo','Activo')) AS Multa_Acumulada`,
        where: `UE.Id_Empresa=${empresaId} AND UE.Estado=1`,
        orderField: 'U.Nombre',
        orderDirection: ' ASC ',
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Usuario),
          idUsuario: Number(row.Id_Usuario),
          codigoUniversitario: row.Numero_Identificacion || '',
          nombre: row.Nombre,
          email: row.Correo || '',
          telefono: row.Telefono || '',
          tipoUsuario: row.Tipo_Usuario || '',
          bloqueado: Number(row.Estado) !== 1,
          prestamosActivos: Number(row.Prestamos_Activos || 0),
          multasPendientes: Number(row.Multa_Acumulada || 0),
          multaAcumulada: Number(row.Multa_Acumulada || 0)
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return this.usuarios;
    }
  }

  async getUsuariosActivosPorTipo(): Promise<{ tipo: string; cantidad: number }[]> {
    const base = [
      { tipo: 'Estudiantes', cantidad: 0 },
      { tipo: 'Docentes', cantidad: 0 },
      { tipo: 'Administrativos', cantidad: 0 }
    ];

    try {
      const empresaId = this.getEmpresaId();
      const data = await this.apiService.postRecord(
        `SELECT
          CASE
            WHEN LOWER(TRIM(COALESCE(U.Tipo_Usuario,''))) IN ('estudiante','estudiantes','alumno','alumnos') THEN 'Estudiantes'
            WHEN LOWER(TRIM(COALESCE(U.Tipo_Usuario,''))) IN ('docente','docentes','profesor','profesores') THEN 'Docentes'
            WHEN LOWER(TRIM(COALESCE(U.Tipo_Usuario,''))) IN ('administrativo','administrativos','administracion') THEN 'Administrativos'
            ELSE 'Otros'
          END AS Tipo,
          COUNT(U.Id_Usuario) AS Cantidad
        FROM Seg_Usuario_Empresa UE
        INNER JOIN Seg_Usuario U ON UE.Id_Usuario = U.Id_Usuario
        WHERE UE.Id_Empresa=${empresaId}
          AND UE.Estado=1
          AND U.Estado=1
        GROUP BY
          CASE
            WHEN LOWER(TRIM(COALESCE(U.Tipo_Usuario,''))) IN ('estudiante','estudiantes','alumno','alumnos') THEN 'Estudiantes'
            WHEN LOWER(TRIM(COALESCE(U.Tipo_Usuario,''))) IN ('docente','docentes','profesor','profesores') THEN 'Docentes'
            WHEN LOWER(TRIM(COALESCE(U.Tipo_Usuario,''))) IN ('administrativo','administrativos','administracion') THEN 'Administrativos'
            ELSE 'Otros'
          END`
      );
      const rows = Array.isArray(data?.data) ? data.data : [];
      return base.map(item => {
        const row = rows.find((value: any) => String(value.Tipo || '').toLowerCase() === item.tipo.toLowerCase());
        return {
          tipo: item.tipo,
          cantidad: Number(row?.Cantidad || row?.cantidad || 0)
        };
      });
    } catch (error) {
      console.error(error);
      return base;
    }
  }

  async createUsuarioBiblioteca(usuario: UsuarioBiblioteca): Promise<any> {
    throw new Error('Los usuarios se crean en Seguridad, no en Biblioteca');
  }

  async updateUsuarioBiblioteca(usuario: UsuarioBiblioteca): Promise<any> {
    throw new Error('Los usuarios se actualizan en Seguridad, no en Biblioteca');
  }

  async deleteUsuarioBiblioteca(id: number): Promise<any> {
    throw new Error('Los usuarios se administran en Seguridad, no en Biblioteca');
  }

  async getCategorias(): Promise<Categoria[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Categoria',
        fields: 'Id_Categoria, Nombre, Codigo',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Categoria),
          nombre: row.Nombre,
          codigo: row.Codigo || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createCategoria(categoria: Categoria): Promise<any> {
    const sql = {
      table: 'Bib_Categoria',
      fields: 'Nombre,Codigo',
      values: `'${this.escapeSql(categoria.nombre)}','${this.escapeSql(categoria.codigo)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateCategoria(categoria: Categoria): Promise<any> {
    const sql = {
      table: 'Bib_Categoria',
      fields: `Nombre='${this.escapeSql(categoria.nombre)}',Codigo='${this.escapeSql(categoria.codigo)}'`,
      where: 'Id_Categoria=' + categoria.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteCategoria(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Categoria WHERE Id_Categoria=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getEditoriales(): Promise<Editorial[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Editorial',
        fields: 'Id_Editorial, Nombre, Sitio_Web',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Editorial),
          nombre: row.Nombre,
          sitioWeb: row.Sitio_Web || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createEditorial(editorial: Editorial): Promise<any> {
    const sql = {
      table: 'Bib_Editorial',
      fields: 'Nombre,Sitio_Web',
      values: `'${this.escapeSql(editorial.nombre)}','${this.escapeSql(editorial.sitioWeb)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateEditorial(editorial: Editorial): Promise<any> {
    const sql = {
      table: 'Bib_Editorial',
      fields: `Nombre='${this.escapeSql(editorial.nombre)}',Sitio_Web='${this.escapeSql(editorial.sitioWeb)}'`,
      where: 'Id_Editorial=' + editorial.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteEditorial(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Editorial WHERE Id_Editorial=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getAutores(): Promise<Autor[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autor',
        fields: 'Id_Autor, Nombre, Nacionalidad, Fecha_Nacimiento',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Autor),
          nombre: row.Nombre,
          nacionalidad: row.Nacionalidad || '',
          fechaNacimiento: row.Fecha_Nacimiento || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createAutor(autor: Autor): Promise<any> {
    const fecha = autor.fechaNacimiento ? `'${autor.fechaNacimiento}'` : 'NULL';
    const sql = {
      table: 'Bib_Autor',
      fields: 'Nombre,Nacionalidad,Fecha_Nacimiento',
      values: `'${this.escapeSql(autor.nombre)}','${this.escapeSql(autor.nacionalidad)}',${fecha}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateAutor(autor: Autor): Promise<any> {
    const fecha = autor.fechaNacimiento ? `'${autor.fechaNacimiento}'` : 'NULL';
    const sql = {
      table: 'Bib_Autor',
      fields: `Nombre='${this.escapeSql(autor.nombre)}',Nacionalidad='${this.escapeSql(autor.nacionalidad)}',Fecha_Nacimiento=${fecha}`,
      where: 'Id_Autor=' + autor.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteAutor(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Autor WHERE Id_Autor=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getTiposMaterial(): Promise<TipoMaterial[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Tipo_Material',
        fields: 'Id_Tipo_Material, Nombre, Descripcion',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Tipo_Material),
          nombre: row.Nombre,
          descripcion: row.Descripcion || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createTipoMaterial(tipo: TipoMaterial): Promise<any> {
    const sql = {
      table: 'Bib_Tipo_Material',
      fields: 'Nombre,Descripcion',
      values: `'${this.escapeSql(tipo.nombre)}','${this.escapeSql(tipo.descripcion)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateTipoMaterial(tipo: TipoMaterial): Promise<any> {
    const sql = {
      table: 'Bib_Tipo_Material',
      fields: `Nombre='${this.escapeSql(tipo.nombre)}',Descripcion='${this.escapeSql(tipo.descripcion)}'`,
      where: 'Id_Tipo_Material=' + tipo.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteTipoMaterial(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Tipo_Material WHERE Id_Tipo_Material=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getTipoMaterialMarcCampos(tipoMaterialId?: number, formatoId?: number): Promise<TipoMaterialMarcCampo[]> {
    try {
      const whereParts = [`R.Id_Empresa=${this.getEmpresaId()}`];
      if (tipoMaterialId) {
        whereParts.push(`R.Tipo_Material_Id=${tipoMaterialId}`);
      }
      if (formatoId) {
        whereParts.push(`C.Id_Formato=${formatoId}`);
      }
      const tagOrderField = this.getTagOrderField('C.Tag');
      const sqlConfig = {
        table: 'Bib_Tipo_Material_Marc_Campo R ' +
          'INNER JOIN Bib_Tipo_Material TM ON R.Tipo_Material_Id = TM.Id_Tipo_Material ' +
          'INNER JOIN Bib_Marc_Dic_Campo C ON R.Dic_Campo_Id = C.Id_Dic_Campo ' +
          'INNER JOIN Bib_Marc_Dic_Formato F ON C.Id_Formato = F.Id_Formato',
        fields: 'R.Id_Tipo_Material_Marc_Campo, R.Tipo_Material_Id, R.Dic_Campo_Id, TM.Nombre AS Tipo_Material, ' +
          'C.Id_Formato, F.Nombre AS Formato, C.Tag, C.Nombre AS Campo',
        where: whereParts.join(' AND '),
        orderField: `TM.Nombre, F.Nombre, ${tagOrderField}`,
        orderDirection: ' ASC ',
        Empresa: false,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Tipo_Material_Marc_Campo),
          tipoMaterialId: Number(row.Tipo_Material_Id),
          dicCampoId: Number(row.Dic_Campo_Id),
          tipoMaterialNombre: row.Tipo_Material || '',
          formatoId: row.Id_Formato ? Number(row.Id_Formato) : undefined,
          formatoNombre: row.Formato || '',
          tag: row.Tag || '',
          campoNombre: row.Campo || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createTipoMaterialMarcCampo(item: TipoMaterialMarcCampo): Promise<any> {
    const sql = {
      table: 'Bib_Tipo_Material_Marc_Campo',
      fields: 'Tipo_Material_Id,Dic_Campo_Id',
      values: `${item.tipoMaterialId},${item.dicCampoId}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async deleteTipoMaterialMarcCampo(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Tipo_Material_Marc_Campo WHERE Id_Tipo_Material_Marc_Campo=${id} AND Id_Empresa=${empresaId}`
    );
  }

  private getEjemplaresTable(): string {
    return 'Bib_Ejemplar E LEFT JOIN Bib_Libro L ON E.Libro_Id = L.Id_Libro';
  }

  private getEjemplaresFields(): string {
    return 'E.Id_Ejemplar, E.Libro_Id, L.Titulo AS Libro_Titulo, E.Codigo_Barra, E.Ubicacion, E.Sede, ' +
      'E.Tipo_Soporte, E.Estado, E.Inventario_Tag, E.URL_Archivo, E.Imagen_Portada, E.Max_Simultaneos';
  }

  private getEjemplaresWhere(search = ''): string {
    const text = this.escapeSql(search.trim());
    if (!text) {
      return '';
    }
    return `(L.Titulo LIKE '%${text}%' ` +
      `OR E.Codigo_Barra LIKE '%${text}%' ` +
      `OR E.Ubicacion LIKE '%${text}%' ` +
      `OR E.Inventario_Tag LIKE '%${text}%')`;
  }

  private mapEjemplarRow(row: any): Ejemplar {
    return {
      id: Number(row.Id_Ejemplar),
      libroId: Number(row.Libro_Id),
      libroTitulo: row.Libro_Titulo || '',
      codigoBarra: row.Codigo_Barra || '',
      ubicacion: row.Ubicacion || '',
      sede: row.Sede || '',
      tipoSoporte: row.Tipo_Soporte || 'fisico',
      estado: row.Estado || 'disponible',
      inventarioTag: row.Inventario_Tag || '',
      urlArchivo: row.URL_Archivo || '',
      imagenPortada: row.Imagen_Portada || '',
      maxSimultaneos: row.Max_Simultaneos != null ? Number(row.Max_Simultaneos) : undefined
    };
  }

  async getEjemplares(): Promise<Ejemplar[]> {
    try {
      const sqlConfig = {
        table: this.getEjemplaresTable(),
        fields: this.getEjemplaresFields(),
        orderField: 'E.Id_Ejemplar',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => this.mapEjemplarRow(row));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /** v2.3: ejemplares de un libro puntual, para la ficha completa del recurso (OPAC). */
  async getEjemplaresPorLibro(libroId: number): Promise<Ejemplar[]> {
    try {
      const empresaId = this.getEmpresaId();
      const sqlConfig = {
        table: this.getEjemplaresTable(),
        fields: this.getEjemplaresFields(),
        where: `E.Libro_Id=${libroId} AND E.Id_Empresa=${empresaId}`,
        orderField: 'E.Id_Ejemplar',
        orderDirection: ' ASC ',
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => this.mapEjemplarRow(row));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getEjemplaresPage(page = 1, pageSize = 50, search = ''): Promise<{ ejemplares: Ejemplar[]; total: number }> {
    try {
      const total = await this.countEjemplares(search);
      if (total === 0) {
        return { ejemplares: [], total };
      }
      const sqlConfig = {
        table: this.getEjemplaresTable(),
        fields: this.getEjemplaresFields(),
        where: this.getEjemplaresWhere(search),
        orderField: 'E.Id_Ejemplar',
        orderDirection: ' DESC ',
        Empresa: true,
        paginacion: {
          FirstRow: (Math.max(1, page) - 1) * pageSize + 1,
          LastRow: Math.max(1, page) * pageSize,
          TotalRows: 0
        }
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      const ejemplares = data && data['data'] ? data['data'].map((row: any) => this.mapEjemplarRow(row)) : [];
      return { ejemplares, total };
    } catch (error) {
      console.error(error);
      return { ejemplares: [], total: 0 };
    }
  }

  async countEjemplares(search = ''): Promise<number> {
    try {
      const sqlConfig = {
        table: this.getEjemplaresTable(),
        fields: 'COUNT(*) AS total',
        where: this.getEjemplaresWhere(search),
        simple: true,
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return Number(data['data'][0].total || 0);
      }
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async countEjemplaresPdf(): Promise<number> {
    try {
      const sqlConfig = {
        table: this.getEjemplaresTable(),
        fields: 'COUNT(*) AS total',
        where: `(LOWER(E.URL_Archivo) LIKE '%.pdf' OR LOWER(E.URL_Archivo) LIKE '%.doc' OR LOWER(E.URL_Archivo) LIKE '%.docx')`,
        simple: true,
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return Number(data['data'][0].total || 0);
      }
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async createEjemplar(ejemplar: Ejemplar): Promise<any> {
    const sql = {
      table: 'Bib_Ejemplar',
      fields: 'Libro_Id,Codigo_Barra,Ubicacion,Sede,Tipo_Soporte,Estado,Inventario_Tag,URL_Archivo,Imagen_Portada,Max_Simultaneos',
      values: `${ejemplar.libroId},'${this.escapeSql(ejemplar.codigoBarra)}',` +
        `'${this.escapeSql(ejemplar.ubicacion)}','${this.escapeSql(ejemplar.sede)}',` +
        `'${this.escapeSql(ejemplar.tipoSoporte)}','${this.escapeSql(ejemplar.estado)}',` +
        `'${this.escapeSql(ejemplar.inventarioTag)}','${this.escapeSql(ejemplar.urlArchivo)}',` +
        `'${this.escapeSql(ejemplar.imagenPortada)}',${ejemplar.maxSimultaneos || 1}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateEjemplar(ejemplar: Ejemplar): Promise<any> {
    const sql = {
      table: 'Bib_Ejemplar',
      fields: `Libro_Id=${ejemplar.libroId},Codigo_Barra='${this.escapeSql(ejemplar.codigoBarra)}',` +
        `Ubicacion='${this.escapeSql(ejemplar.ubicacion)}',Sede='${this.escapeSql(ejemplar.sede)}',` +
        `Tipo_Soporte='${this.escapeSql(ejemplar.tipoSoporte)}',Estado='${this.escapeSql(ejemplar.estado)}',` +
        `Inventario_Tag='${this.escapeSql(ejemplar.inventarioTag)}',URL_Archivo='${this.escapeSql(ejemplar.urlArchivo)}',` +
        `Imagen_Portada='${this.escapeSql(ejemplar.imagenPortada)}',Max_Simultaneos=${ejemplar.maxSimultaneos || 1}`,
      where: 'Id_Ejemplar=' + ejemplar.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteEjemplar(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Ejemplar WHERE Id_Ejemplar=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getPoliticasPrestamo(): Promise<PoliticaPrestamo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Politica_Prestamo',
        fields: 'Id_Politica_Prestamo, Tipo_Usuario, Tipo_Material_Id, Dias_Prestamo, Max_Renovaciones, Max_Prestamos, Max_Reservas, Multa_Diaria',
        orderField: 'Tipo_Usuario',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Politica_Prestamo),
          tipoUsuario: row.Tipo_Usuario,
          tipoMaterialId: Number(row.Tipo_Material_Id),
          diasPrestamo: Number(row.Dias_Prestamo),
          maxRenovaciones: Number(row.Max_Renovaciones),
          maxPrestamos: Number(row.Max_Prestamos),
          maxReservas: Number(row.Max_Reservas ?? row.Max_Prestamos ?? 2),
          multaDiaria: Number(row.Multa_Diaria)
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createPoliticaPrestamo(politica: PoliticaPrestamo): Promise<any> {
    const sql = {
      table: 'Bib_Politica_Prestamo',
      fields: 'Tipo_Usuario,Tipo_Material_Id,Dias_Prestamo,Max_Renovaciones,Max_Prestamos,Max_Reservas,Multa_Diaria',
      values: `'${this.escapeSql(politica.tipoUsuario)}',${politica.tipoMaterialId},${politica.diasPrestamo},` +
        `${politica.maxRenovaciones},${politica.maxPrestamos},${politica.maxReservas ?? politica.maxPrestamos},${politica.multaDiaria}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updatePoliticaPrestamo(politica: PoliticaPrestamo): Promise<any> {
    const sql = {
      table: 'Bib_Politica_Prestamo',
      fields: `Tipo_Usuario='${this.escapeSql(politica.tipoUsuario)}',Tipo_Material_Id=${politica.tipoMaterialId},` +
        `Dias_Prestamo=${politica.diasPrestamo},Max_Renovaciones=${politica.maxRenovaciones},` +
        `Max_Prestamos=${politica.maxPrestamos},Max_Reservas=${politica.maxReservas ?? politica.maxPrestamos},` +
        `Multa_Diaria=${politica.multaDiaria}`,
      where: 'Id_Politica_Prestamo=' + politica.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deletePoliticaPrestamo(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Politica_Prestamo WHERE Id_Politica_Prestamo=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getMultas(): Promise<Multa[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Multa M INNER JOIN Seg_Usuario U ON M.Usuario_Id = U.Id_Usuario',
        fields: 'M.Id_Multa, M.Usuario_Id, U.Nombre AS Usuario, M.Prestamo_Id, M.Monto, M.Saldo, M.Motivo, M.Fecha_Generacion, M.Fecha_Pago, M.Estado',
        orderField: 'M.Fecha_Generacion',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Multa),
          usuarioId: Number(row.Usuario_Id),
          usuarioNombre: row.Usuario,
          prestamoId: row.Prestamo_Id ? Number(row.Prestamo_Id) : undefined,
          monto: Number(row.Monto),
          saldo: Number(row.Saldo),
          motivo: row.Motivo,
          fechaGeneracion: row.Fecha_Generacion,
          fechaPago: row.Fecha_Pago || '',
          estado: row.Estado
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createMulta(multa: Multa): Promise<any> {
    const sql = {
      table: 'Bib_Multa',
      fields: 'Usuario_Id,Prestamo_Id,Monto,Saldo,Motivo,Estado',
      values: `${multa.usuarioId},${multa.prestamoId || 'NULL'},${multa.monto},${multa.saldo},` +
        `'${this.escapeSql(multa.motivo)}','${this.escapeSql(multa.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateMulta(multa: Multa): Promise<any> {
    const sql = {
      table: 'Bib_Multa',
      fields: `Usuario_Id=${multa.usuarioId},Prestamo_Id=${multa.prestamoId || 'NULL'},` +
        `Monto=${multa.monto},Saldo=${multa.saldo},Motivo='${this.escapeSql(multa.motivo)}',` +
        `Estado='${this.escapeSql(multa.estado)}',Fecha_Pago=${multa.fechaPago ? `'${multa.fechaPago}'` : 'NULL'}`,
      where: 'Id_Multa=' + multa.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteMulta(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Multa WHERE Id_Multa=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getRoles(): Promise<RolBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Rol',
        fields: 'Id_Rol, Nombre',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Rol),
          nombre: row.Nombre
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private getPermisosBaseBiblioteca(): PermisoBiblioteca[] {
    return [
      { id: 0, codigo: 'biblioteca.seguridad.gestionar', descripcion: 'Gestionar seguridad, roles y permisos de biblioteca' },
      { id: 0, codigo: 'biblioteca.catalogacion.gestionar', descripcion: 'Gestionar catalogacion, catalogos y ejemplares' },
      { id: 0, codigo: 'biblioteca.archivo.subir', descripcion: 'Subir archivos digitales en ejemplares' },
      { id: 0, codigo: 'biblioteca.archivo.ver', descripcion: 'Ver archivos digitales en ejemplares' },
      { id: 0, codigo: 'biblioteca.circulacion.gestionar', descripcion: 'Gestionar prestamos, reservas y circulacion digital' },
      { id: 0, codigo: 'biblioteca.reportes.ver', descripcion: 'Ver reportes de biblioteca' },
      { id: 0, codigo: 'biblioteca.adquisiciones.gestionar', descripcion: 'Gestionar adquisiciones de biblioteca' },
      { id: 0, codigo: 'biblioteca.opac.gestionar', descripcion: 'Gestionar contenidos sociales de OPAC' },
      { id: 0, codigo: 'biblioteca.opac.ver', descripcion: 'Consultar OPAC y catalogo publico' },
      { id: 0, codigo: 'biblioteca.opac.reservar', descripcion: 'Solicitar o reservar recursos digitales desde OPAC' }
    ];
  }

  private getRolesBaseBiblioteca(): string[] {
    return ['Administrador', 'Bibliotecario', 'Docente', 'Estudiante', 'Administrativo'];
  }

  private getPermisosPorRolBase(): Record<string, string[]> {
    const todos = this.getPermisosBaseBiblioteca().map(permiso => permiso.codigo);
    return {
      Administrador: todos,
      Bibliotecario: [
        'biblioteca.catalogacion.gestionar',
        'biblioteca.archivo.subir',
        'biblioteca.archivo.ver',
        'biblioteca.circulacion.gestionar',
        'biblioteca.reportes.ver',
        'biblioteca.adquisiciones.gestionar',
        'biblioteca.opac.gestionar',
        'biblioteca.opac.ver',
        'biblioteca.opac.reservar'
      ],
      Docente: [
        'biblioteca.archivo.ver',
        'biblioteca.opac.ver',
        'biblioteca.opac.reservar'
      ],
      Estudiante: [
        'biblioteca.archivo.ver',
        'biblioteca.opac.ver',
        'biblioteca.opac.reservar'
      ],
      Administrativo: [
        'biblioteca.archivo.ver',
        'biblioteca.opac.ver',
        'biblioteca.opac.reservar'
      ]
    };
  }

  private async countTableRows(table: string): Promise<number> {
    try {
      const data = await this.apiService.executeSqlSyn({
        table,
        fields: 'COUNT(*) AS Total',
        simple: true,
        Empresa: true
      });
      return this.getResponseTotal(data);
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  private async getRolByNombre(nombre: string): Promise<RolBiblioteca | null> {
    const data = await this.apiService.executeSqlSyn({
      table: 'Bib_Rol',
      fields: 'Id_Rol, Nombre',
      where: `Nombre='${this.escapeSql(nombre)}'`,
      orderField: 'Id_Rol',
      orderDirection: ' ASC ',
      simple: true,
      Empresa: true
    });
    if (data && data['total'] > 0) {
      return { id: Number(data['data'][0]['Id_Rol']), nombre: data['data'][0]['Nombre'] };
    }
    return null;
  }

  private async getPermisoByCodigo(codigo: string): Promise<PermisoBiblioteca | null> {
    const data = await this.apiService.executeSqlSyn({
      table: 'Bib_Permiso',
      fields: 'Id_Permiso, Codigo, Descripcion',
      where: `Codigo='${this.escapeSql(codigo)}'`,
      orderField: 'Id_Permiso',
      orderDirection: ' ASC ',
      simple: true,
      Empresa: true
    });
    if (data && data['total'] > 0) {
      return {
        id: Number(data['data'][0]['Id_Permiso']),
        codigo: data['data'][0]['Codigo'],
        descripcion: data['data'][0]['Descripcion'] || ''
      };
    }
    return null;
  }

  private async ensureRolPermiso(rolId: number, permisoId: number): Promise<void> {
    const existe = await this.apiService.executeSqlSyn({
      table: 'Bib_Rol_Permiso',
      fields: 'Id_Rol_Permiso',
      where: `Rol_Id=${rolId} AND Permiso_Id=${permisoId}`,
      orderField: 'Id_Rol_Permiso',
      orderDirection: ' ASC ',
      simple: true,
      Empresa: true
    });
    if (existe && existe['total'] > 0) {
      return;
    }
    await this.createRolPermiso({ id: 0, rolId, permisoId });
  }

  private async ensureUsuarioAdministradorInicial(): Promise<void> {
    const asignaciones = await this.countTableRows('Bib_Usuario_Rol');
    if (asignaciones > 0) {
      return;
    }
    const usuarioId = await this.getUsuarioSistemaId();
    const rolAdministrador = await this.getRolByNombre('Administrador');
    if (!usuarioId || !rolAdministrador) {
      return;
    }
    await this.createUsuarioRol({
      id: 0,
      usuarioId,
      rolId: rolAdministrador.id
    });
  }

  async ensureSeguridadBaseBiblioteca(): Promise<void> {
    try {
      for (const nombre of this.getRolesBaseBiblioteca()) {
        const existente = await this.getRolByNombre(nombre);
        if (!existente) {
          await this.createRol({ id: 0, nombre });
        }
      }

      for (const permiso of this.getPermisosBaseBiblioteca()) {
        const existente = await this.getPermisoByCodigo(permiso.codigo);
        if (!existente) {
          await this.createPermiso(permiso);
        }
      }

      const matriz = this.getPermisosPorRolBase();
      for (const [nombreRol, codigos] of Object.entries(matriz)) {
        const rol = await this.getRolByNombre(nombreRol);
        if (!rol) continue;
        for (const codigo of codigos) {
          const permiso = await this.getPermisoByCodigo(codigo);
          if (permiso) {
            await this.ensureRolPermiso(rol.id, permiso.id);
          }
        }
      }

      await this.ensureUsuarioAdministradorInicial();
    } catch (error) {
      console.error(error);
    }
  }

  async createRol(rol: RolBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Rol',
      fields: 'Nombre',
      values: `'${this.escapeSql(rol.nombre)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateRol(rol: RolBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Rol',
      fields: `Nombre='${this.escapeSql(rol.nombre)}'`,
      where: 'Id_Rol=' + rol.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteRol(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Rol WHERE Id_Rol=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getPermisos(): Promise<PermisoBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Permiso',
        fields: 'Id_Permiso, Codigo, Descripcion',
        orderField: 'Codigo',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Permiso),
          codigo: row.Codigo,
          descripcion: row.Descripcion || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private esPermisoBaseBiblioteca(codigo: string): boolean {
    return this.getPermisosBaseBiblioteca().some(permiso => permiso.codigo === codigo);
  }

  private getPostRecordRows(response: any): any[] {
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  }

  async hasPermiso(codigo: string): Promise<boolean> {
    try {
      const usuarioId = await this.getUsuarioSistemaId();
      if (!usuarioId) {
        return false;
      }

      const empresaId = this.getEmpresaId();
      const codigoEscapado = this.escapeSql(codigo);
      const data = await this.apiService.postRecord(
        `SELECT
          (SELECT COUNT(P.Id_Permiso)
             FROM Bib_Permiso P
            WHERE P.Id_Empresa=${empresaId}
              AND P.Codigo='${codigoEscapado}') AS PermisoExiste,
          (SELECT COUNT(UR.Id_Usuario_Rol)
             FROM Bib_Usuario_Rol UR
             INNER JOIN Bib_Rol R ON UR.Rol_Id = R.Id_Rol
            WHERE UR.Id_Empresa=${empresaId}
              AND R.Id_Empresa=${empresaId}
              AND UR.Id_Usuario=${usuarioId}
              AND LOWER(TRIM(R.Nombre))='administrador') AS EsAdministrador,
          (SELECT COUNT(UR2.Id_Usuario_Rol)
             FROM Bib_Usuario_Rol UR2
             INNER JOIN Bib_Rol_Permiso RP ON UR2.Rol_Id = RP.Rol_Id
             INNER JOIN Bib_Permiso P2 ON RP.Permiso_Id = P2.Id_Permiso
            WHERE UR2.Id_Empresa=${empresaId}
              AND RP.Id_Empresa=${empresaId}
              AND P2.Id_Empresa=${empresaId}
              AND UR2.Id_Usuario=${usuarioId}
              AND P2.Codigo='${codigoEscapado}') AS TienePermiso`
      );
      const row = this.getPostRecordRows(data)[0];
      if (!row) {
        return false;
      }
      if (Number(row.PermisoExiste || row.permisoExiste || 0) === 0) {
        return true;
      }
      if (this.esPermisoBaseBiblioteca(codigo) && Number(row.EsAdministrador || row.esAdministrador || 0) > 0) {
        return true;
      }
      return Number(row.TienePermiso || row.tienePermiso || 0) > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async subirArchivoPublico(formData: FormData): Promise<any> {
    return await this.apiService.loadPublicFile(formData);
  }

  async createPermiso(permiso: PermisoBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Permiso',
      fields: 'Codigo,Descripcion',
      values: `'${this.escapeSql(permiso.codigo)}','${this.escapeSql(permiso.descripcion)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updatePermiso(permiso: PermisoBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Permiso',
      fields: `Codigo='${this.escapeSql(permiso.codigo)}',Descripcion='${this.escapeSql(permiso.descripcion)}'`,
      where: 'Id_Permiso=' + permiso.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deletePermiso(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Permiso WHERE Id_Permiso=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getRolesPermisos(): Promise<RolPermiso[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Rol_Permiso RP INNER JOIN Bib_Rol R ON RP.Rol_Id = R.Id_Rol INNER JOIN Bib_Permiso P ON RP.Permiso_Id = P.Id_Permiso',
        fields: 'RP.Id_Rol_Permiso, RP.Rol_Id, RP.Permiso_Id, R.Nombre AS Rol, P.Codigo AS Permiso',
        orderField: 'R.Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Rol_Permiso),
          rolId: Number(row.Rol_Id),
          permisoId: Number(row.Permiso_Id),
          rolNombre: row.Rol,
          permisoCodigo: row.Permiso
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createRolPermiso(item: RolPermiso): Promise<any> {
    const sql = {
      table: 'Bib_Rol_Permiso',
      fields: 'Rol_Id,Permiso_Id',
      values: `${item.rolId},${item.permisoId}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async deleteRolPermiso(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Rol_Permiso WHERE Id_Rol_Permiso=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getUsuariosRoles(): Promise<UsuarioRol[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Usuario_Rol UR INNER JOIN Seg_Usuario U ON UR.Id_Usuario = U.Id_Usuario INNER JOIN Bib_Rol R ON UR.Rol_Id = R.Id_Rol',
        fields: 'UR.Id_Usuario_Rol, UR.Id_Usuario, UR.Rol_Id, U.Nombre AS Usuario, R.Nombre AS Rol',
        orderField: 'U.Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Usuario_Rol),
          usuarioId: Number(row.Id_Usuario),
          rolId: Number(row.Rol_Id),
          usuarioNombre: row.Usuario,
          rolNombre: row.Rol
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async bibUsuarioRolTieneIdUsuario(): Promise<boolean> {
    try {
      const data = await this.apiService.postRecord(
        'SELECT Id_Usuario FROM Bib_Usuario_Rol WHERE 1=0'
      );
      return !!data && data['success'] !== false && data['success'] !== 'false';
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async createUsuarioRol(item: UsuarioRol): Promise<any> {
    const migrado = await this.bibUsuarioRolTieneIdUsuario();
    if (!migrado) {
      throw new Error('Pendiente ejecutar migracion SQL: docs/sql/biblioteca-v1-6-7-migrar-usuario-rol.sql');
    }

    const data = await this.apiService.postRecord(
      `INSERT INTO Bib_Usuario_Rol (Id_Usuario,Rol_Id,Id_Empresa,Creado_Por,Creado_El) ` +
      `VALUES (${item.usuarioId},${item.rolId},${this.getEmpresaId()},'${this.escapeSql(this.getNombreUsuarioActual())}',NOW())`
    );
    if (!data || data['success'] !== 'true') {
      throw new Error(data?.['error'] || 'Error al asignar el rol');
    }
    return data;
  }

  async updateUsuarioRol(item: UsuarioRol): Promise<any> {
    const migrado = await this.bibUsuarioRolTieneIdUsuario();
    if (!migrado) {
      throw new Error('Pendiente ejecutar migracion SQL: docs/sql/biblioteca-v1-6-7-migrar-usuario-rol.sql');
    }

    const sql = {
      table: 'Bib_Usuario_Rol',
      fields: `Id_Usuario=${item.usuarioId},Rol_Id=${item.rolId}`,
      where: `Id_Usuario_Rol=${item.id} AND Id_Empresa=${this.getEmpresaId()}`
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteUsuarioRol(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Usuario_Rol WHERE Id_Usuario_Rol=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getSeriales(): Promise<Serial[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Serial S INNER JOIN Bib_Libro L ON S.Libro_Id = L.Id_Libro',
        fields: 'S.Id_Serial, S.Libro_Id, L.Titulo AS Libro, S.Frecuencia',
        orderField: 'L.Titulo',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Serial),
          libroId: Number(row.Libro_Id),
          libroTitulo: row.Libro || '',
          frecuencia: row.Frecuencia || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createSerial(serial: Serial): Promise<any> {
    const sql = {
      table: 'Bib_Serial',
      fields: 'Libro_Id,Frecuencia',
      values: `${serial.libroId},'${this.escapeSql(serial.frecuencia)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateSerial(serial: Serial): Promise<any> {
    const sql = {
      table: 'Bib_Serial',
      fields: `Libro_Id=${serial.libroId},Frecuencia='${this.escapeSql(serial.frecuencia)}'`,
      where: 'Id_Serial=' + serial.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteSerial(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Serial WHERE Id_Serial=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getSuscripciones(): Promise<SuscripcionSerial[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Suscripcion',
        fields: 'Id_Suscripcion, Serial_Id, Proveedor, Fecha_Inicio, Fecha_Fin, Frecuencia, Estado',
        orderField: 'Fecha_Inicio',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Suscripcion),
          serialId: Number(row.Serial_Id),
          proveedor: row.Proveedor || '',
          fechaInicio: row.Fecha_Inicio,
          fechaFin: row.Fecha_Fin || '',
          frecuencia: row.Frecuencia || '',
          estado: row.Estado || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createSuscripcion(item: SuscripcionSerial): Promise<any> {
    const fechaFin = item.fechaFin ? `'${item.fechaFin}'` : 'NULL';
    const sql = {
      table: 'Bib_Suscripcion',
      fields: 'Serial_Id,Proveedor,Fecha_Inicio,Fecha_Fin,Frecuencia,Estado',
      values: `${item.serialId},'${this.escapeSql(item.proveedor)}','${item.fechaInicio}',${fechaFin},` +
        `'${this.escapeSql(item.frecuencia)}','${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateSuscripcion(item: SuscripcionSerial): Promise<any> {
    const fechaFin = item.fechaFin ? `'${item.fechaFin}'` : 'NULL';
    const sql = {
      table: 'Bib_Suscripcion',
      fields: `Serial_Id=${item.serialId},Proveedor='${this.escapeSql(item.proveedor)}',` +
        `Fecha_Inicio='${item.fechaInicio}',Fecha_Fin=${fechaFin},` +
        `Frecuencia='${this.escapeSql(item.frecuencia)}',Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Suscripcion=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteSuscripcion(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Suscripcion WHERE Id_Suscripcion=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getSerialNumeros(): Promise<SerialNumero[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Serial_Numero',
        fields: 'Id_Serial_Numero, Serial_Id, Volumen, Numero, Fecha_Prevista, Fecha_Recibido, Estado',
        orderField: 'Id_Serial_Numero',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Serial_Numero),
          serialId: Number(row.Serial_Id),
          volumen: row.Volumen || '',
          numero: row.Numero || '',
          fechaPrevista: row.Fecha_Prevista || '',
          fechaRecibido: row.Fecha_Recibido || '',
          estado: row.Estado || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createSerialNumero(item: SerialNumero): Promise<any> {
    const fechaPrevista = item.fechaPrevista ? `'${item.fechaPrevista}'` : 'NULL';
    const fechaRecibido = item.fechaRecibido ? `'${item.fechaRecibido}'` : 'NULL';
    const sql = {
      table: 'Bib_Serial_Numero',
      fields: 'Serial_Id,Volumen,Numero,Fecha_Prevista,Fecha_Recibido,Estado',
      values: `${item.serialId},'${this.escapeSql(item.volumen)}','${this.escapeSql(item.numero)}',` +
        `${fechaPrevista},${fechaRecibido},'${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateSerialNumero(item: SerialNumero): Promise<any> {
    const fechaPrevista = item.fechaPrevista ? `'${item.fechaPrevista}'` : 'NULL';
    const fechaRecibido = item.fechaRecibido ? `'${item.fechaRecibido}'` : 'NULL';
    const sql = {
      table: 'Bib_Serial_Numero',
      fields: `Serial_Id=${item.serialId},Volumen='${this.escapeSql(item.volumen)}',Numero='${this.escapeSql(item.numero)}',` +
        `Fecha_Prevista=${fechaPrevista},Fecha_Recibido=${fechaRecibido},Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Serial_Numero=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteSerialNumero(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Serial_Numero WHERE Id_Serial_Numero=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getSerialRecepciones(): Promise<SerialRecepcion[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Serial_Recepcion',
        fields: 'Id_Serial_Recepcion, Serial_Numero_Id, Ejemplar_Id, Fecha_Recepcion, Estado',
        orderField: 'Fecha_Recepcion',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Serial_Recepcion),
          serialNumeroId: Number(row.Serial_Numero_Id),
          ejemplarId: row.Ejemplar_Id ? Number(row.Ejemplar_Id) : undefined,
          fechaRecepcion: row.Fecha_Recepcion,
          estado: row.Estado || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createSerialRecepcion(item: SerialRecepcion): Promise<any> {
    const sql = {
      table: 'Bib_Serial_Recepcion',
      fields: 'Serial_Numero_Id,Ejemplar_Id,Estado',
      values: `${item.serialNumeroId},${item.ejemplarId || 'NULL'},'${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateSerialRecepcion(item: SerialRecepcion): Promise<any> {
    const sql = {
      table: 'Bib_Serial_Recepcion',
      fields: `Serial_Numero_Id=${item.serialNumeroId},Ejemplar_Id=${item.ejemplarId || 'NULL'},` +
        `Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Serial_Recepcion=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteSerialRecepcion(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Serial_Recepcion WHERE Id_Serial_Recepcion=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getTesis(): Promise<Tesis[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Tesis',
        fields: 'Id_Tesis, Libro_Id, Universidad, Facultad, Carrera, Tutor, Autor_Institucional, Fecha_Defensa',
        orderField: 'Id_Tesis',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Tesis),
          libroId: Number(row.Libro_Id),
          universidad: row.Universidad || '',
          facultad: row.Facultad || '',
          carrera: row.Carrera || '',
          tutor: row.Tutor || '',
          autorInstitucional: row.Autor_Institucional || '',
          fechaDefensa: row.Fecha_Defensa || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createTesis(item: Tesis): Promise<any> {
    const fechaDefensa = item.fechaDefensa ? `'${item.fechaDefensa}'` : 'NULL';
    const sql = {
      table: 'Bib_Tesis',
      fields: 'Libro_Id,Universidad,Facultad,Carrera,Tutor,Autor_Institucional,Fecha_Defensa',
      values: `${item.libroId},'${this.escapeSql(item.universidad)}','${this.escapeSql(item.facultad)}',` +
        `'${this.escapeSql(item.carrera)}','${this.escapeSql(item.tutor)}',` +
        `'${this.escapeSql(item.autorInstitucional)}',${fechaDefensa}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateTesis(item: Tesis): Promise<any> {
    const fechaDefensa = item.fechaDefensa ? `'${item.fechaDefensa}'` : 'NULL';
    const sql = {
      table: 'Bib_Tesis',
      fields: `Libro_Id=${item.libroId},Universidad='${this.escapeSql(item.universidad)}',` +
        `Facultad='${this.escapeSql(item.facultad)}',Carrera='${this.escapeSql(item.carrera)}',` +
        `Tutor='${this.escapeSql(item.tutor)}',Autor_Institucional='${this.escapeSql(item.autorInstitucional)}',` +
        `Fecha_Defensa=${fechaDefensa}`,
      where: 'Id_Tesis=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteTesis(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Tesis WHERE Id_Tesis=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getMarcRegistros(): Promise<MarcRegistro[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Registro',
        fields: 'Id_Marc_Registro, Libro_Id, Formato, Leader, Control_001, Control_005, Control_008',
        orderField: 'Id_Marc_Registro',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Marc_Registro),
          libroId: Number(row.Libro_Id),
          formato: row.Formato,
          leader: row.Leader || '',
          control001: row.Control_001 || '',
          control005: row.Control_005 || '',
          control008: row.Control_008 || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private mapMarcRegistroRow(row: any): MarcRegistro {
    return {
      id: Number(row.Id_Marc_Registro),
      libroId: Number(row.Libro_Id),
      formato: row.Formato,
      leader: row.Leader || '',
      control001: row.Control_001 || '',
      control005: row.Control_005 || '',
      control008: row.Control_008 || ''
    };
  }

  async getMarcRegistroByLibroId(libroId: number, formato?: string): Promise<MarcRegistro | undefined> {
    try {
      const formatoWhere = formato ? ` AND Formato='${this.escapeSql(formato)}'` : '';
      const sqlConfig = {
        table: 'Bib_Marc_Registro',
        fields: 'Id_Marc_Registro, Libro_Id, Formato, Leader, Control_001, Control_005, Control_008',
        where: `Libro_Id=${Number(libroId)}${formatoWhere}`,
        orderField: 'Id_Marc_Registro',
        orderDirection: ' DESC ',
        simple: true,
        Empresa: true
      };
      let data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return this.mapMarcRegistroRow(data['data'][0]);
      }
      if (formato) {
        data = await this.apiService.executeSqlSyn({
          ...sqlConfig,
          where: `Libro_Id=${Number(libroId)}`
        });
        if (data && data['data'] && data['data'].length > 0) {
          return this.mapMarcRegistroRow(data['data'][0]);
        }
      }
      return undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async createMarcRegistro(item: MarcRegistro): Promise<number | null> {
    const sql = `CALL sp_Bib_Crear_Marc_Registro(${item.libroId},` +
      ` '${this.escapeSql(item.formato)}',` +
      ` '${this.escapeSql(item.leader)}',` +
      ` '${this.escapeSql(item.control005)}',` +
      ` '${this.escapeSql(item.control008)}',` +
      ` ${this.getEmpresaId()},` +
      ` '${this.escapeSql(this.getNombreUsuarioActual())}');`;
    const response = await this.callMarcProcedure(sql, 'Error SQL al crear el registro MARC');
    const row = this.getFirstDataRow(response);
    const registroId = Number(row?.Id_Marc_Registro || 0);
    const control001 = row?.Control_001 || row?.control001 || '';
    if (registroId) {
      item.control001 = control001;
      return registroId;
    }
    const registro = await this.resolveMarcRegistroSummary(item.libroId, item.formato);
    if (registro) {
      item.control001 = registro.control001;
      return registro.id;
    }
    return null;
  }

  async updateMarcRegistro(item: MarcRegistro): Promise<any> {
    let control001 = item.control001 || await this.resolveMarcRegistroControl001ById(item.id);
    if (!control001 && item.id) {
      control001 = await this.ensureMarcRegistroControl001(item);
    }
    if (!control001) {
      throw new Error('No se pudo asignar el consecutivo MARC 001');
    }
    const sql = {
      table: 'Bib_Marc_Registro',
      fields: `Libro_Id=${item.libroId},Formato='${this.escapeSql(item.formato)}',Leader='${this.escapeSql(item.leader)}',` +
        `Control_001='${this.escapeSql(control001)}',Control_005='${this.escapeSql(item.control005)}',` +
        `Control_008='${this.escapeSql(item.control008)}'`,
      where: 'Id_Marc_Registro=' + item.id
    };
    const response = await this.apiService.updateRecord(sql);
    return this.ensureSqlSuccess(response, 'Error SQL al actualizar el registro MARC');
  }

  async deleteMarcRegistro(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Marc_Registro WHERE Id_Marc_Registro=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getMarcCampos(): Promise<MarcCampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Campo',
        fields: 'Id_Marc_Campo, Marc_Registro_Id, Tag, Ind1, Ind2, Valor',
        orderField: 'Id_Marc_Campo',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Marc_Campo),
          marcRegistroId: Number(row.Marc_Registro_Id),
          tag: row.Tag,
          ind1: row.Ind1 || '',
          ind2: row.Ind2 || '',
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createMarcCampo(item: MarcCampo): Promise<number | null> {
    const sql = {
      table: 'Bib_Marc_Campo',
      fields: 'Marc_Registro_Id,Tag,Ind1,Ind2,Valor',
      values: `${item.marcRegistroId},'${this.escapeSql(item.tag)}','${this.escapeSql(item.ind1)}',` +
        `'${this.escapeSql(item.ind2)}','${this.escapeSql(item.valor)}'`
    };
    let data = await this.apiService.insertRecord(sql);
    const insertId = this.extractInsertId(data);
    if (insertId) {
      return insertId;
    }
    return await this.resolveMarcCampoId(item.marcRegistroId, item.tag, item.ind1, item.ind2, item.valor);
  }

  async updateMarcCampo(item: MarcCampo): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Campo',
      fields: `Marc_Registro_Id=${item.marcRegistroId},Tag='${this.escapeSql(item.tag)}',` +
        `Ind1='${this.escapeSql(item.ind1)}',Ind2='${this.escapeSql(item.ind2)}',Valor='${this.escapeSql(item.valor)}'`,
      where: 'Id_Marc_Campo=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteMarcCampo(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Marc_Campo WHERE Id_Marc_Campo=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getMarcSubcampos(): Promise<MarcSubcampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Subcampo',
        fields: 'Id_Marc_Subcampo, Marc_Campo_Id, Codigo, Valor',
        orderField: 'Id_Marc_Subcampo',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Marc_Subcampo),
          marcCampoId: Number(row.Marc_Campo_Id),
          codigo: row.Codigo,
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getMarcSubcamposByCampo(marcCampoId: number): Promise<MarcSubcampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Subcampo',
        fields: 'Id_Marc_Subcampo, Marc_Campo_Id, Codigo, Valor',
        where: `Marc_Campo_Id=${marcCampoId}`,
        orderField: 'Id_Marc_Subcampo',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Marc_Subcampo),
          marcCampoId: Number(row.Marc_Campo_Id),
          codigo: row.Codigo,
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createMarcSubcampo(item: MarcSubcampo): Promise<number | null> {
    const sql = {
      table: 'Bib_Marc_Subcampo',
      fields: 'Marc_Campo_Id,Codigo,Valor',
      values: `${item.marcCampoId},'${this.escapeSql(item.codigo)}','${this.escapeSql(item.valor)}'`
    };
    let data = await this.apiService.insertRecord(sql);
    const insertId = this.extractInsertId(data);
    if (insertId) {
      return insertId;
    }
    return await this.resolveMarcSubcampoId(item.marcCampoId, item.codigo, item.valor);
  }

  async updateMarcSubcampo(item: MarcSubcampo): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Subcampo',
      fields: `Marc_Campo_Id=${item.marcCampoId},Codigo='${this.escapeSql(item.codigo)}',Valor='${this.escapeSql(item.valor)}'`,
      where: 'Id_Marc_Subcampo=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteMarcSubcampo(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Marc_Subcampo WHERE Id_Marc_Subcampo=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async clearMarcDataForLibro(libroId: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    const deleteSubcampos = `
      DELETE FROM Bib_Marc_Subcampo
      WHERE Marc_Campo_Id IN (
        SELECT C.Id_Marc_Campo
        FROM Bib_Marc_Campo C
        JOIN Bib_Marc_Registro R ON C.Marc_Registro_Id = R.Id_Marc_Registro
        WHERE R.Libro_Id=${libroId} AND R.Id_Empresa=${empresaId}
      ) AND Id_Empresa=${empresaId}`;
    await this.apiService.postRecord(deleteSubcampos);

    const deleteCampos = `
      DELETE FROM Bib_Marc_Campo
      WHERE Marc_Registro_Id IN (
        SELECT Id_Marc_Registro
        FROM Bib_Marc_Registro
        WHERE Libro_Id=${libroId} AND Id_Empresa=${empresaId}
      ) AND Id_Empresa=${empresaId}`;
    await this.apiService.postRecord(deleteCampos);

    return await this.apiService.postRecord(
      `DELETE FROM Bib_Marc_Registro WHERE Libro_Id=${libroId} AND Id_Empresa=${empresaId}`
    );
  }

  async getMarcDicFormatos(): Promise<MarcDicFormato[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Formato',
        fields: 'Id_Formato, Codigo, Nombre, Fuente, Version, Url_Fuente, Activo, Creado_El',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Formato),
          codigo: row.Codigo,
          nombre: row.Nombre,
          fuente: row.Fuente || '',
          version: row.Version || '',
          urlFuente: row.Url_Fuente || '',
          activo: Number(row.Activo || 0) === 1,
          creadoEl: row.Creado_El || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createMarcDicFormato(item: MarcDicFormato): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Dic_Formato',
      fields: 'Codigo,Nombre,Fuente,Version,Url_Fuente,Activo',
      values: `'${this.escapeSql(item.codigo)}','${this.escapeSql(item.nombre)}',` +
        `'${this.escapeSql(item.fuente || '')}','${this.escapeSql(item.version || '')}',` +
        `'${this.escapeSql(item.urlFuente || '')}',${item.activo ? 1 : 0}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateMarcDicFormato(item: MarcDicFormato): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Dic_Formato',
      fields: `Codigo='${this.escapeSql(item.codigo)}',Nombre='${this.escapeSql(item.nombre)}',` +
        `Fuente='${this.escapeSql(item.fuente || '')}',Version='${this.escapeSql(item.version || '')}',` +
        `Url_Fuente='${this.escapeSql(item.urlFuente || '')}',Activo=${item.activo ? 1 : 0}`,
      where: 'Id_Formato=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteMarcDicFormato(id: number): Promise<any> {
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Marc_Dic_Formato WHERE Id_Formato=${id}`
    );
  }

  async getMarcDicCampos(): Promise<MarcDicCampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Campo C LEFT JOIN Bib_Marc_Dic_Formato F ON C.Id_Formato = F.Id_Formato',
        fields: 'C.Id_Dic_Campo, C.Id_Formato, F.Nombre AS Formato, C.Tag, C.Nombre, C.Grupo, C.Repetibilidad, C.Es_Control, C.Es_Obsoleto, C.Orden',
        orderField: 'C.Orden, C.Tag',
        orderDirection: ' ASC ',
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Campo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          nombre: row.Nombre,
          grupo: row.Grupo || '',
          repetibilidad: row.Repetibilidad || undefined,
          esControl: Number(row.Es_Control || 0) === 1,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1,
          orden: row.Orden ? Number(row.Orden) : undefined
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getMarcSubcamposByCampos(marcCampoIds: number[]): Promise<MarcSubcampo[]> {
    if (marcCampoIds.length === 0) {
      return [];
    }
    try {
      const ids = Array.from(new Set(marcCampoIds.filter(id => Number(id) > 0)));
      if (ids.length === 0) {
        return [];
      }
      const sqlConfig = {
        table: 'Bib_Marc_Subcampo',
        fields: 'Id_Marc_Subcampo, Marc_Campo_Id, Codigo, Valor',
        where: `Marc_Campo_Id IN (${ids.join(',')})`,
        orderField: 'Id_Marc_Subcampo',
        orderDirection: ' ASC ',
        Empresa: true,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Marc_Subcampo),
          marcCampoId: Number(row.Marc_Campo_Id),
          codigo: row.Codigo,
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getMarcDicCamposByFormato(formatoId: number): Promise<MarcDicCampo[]> {
    if (!formatoId) {
      return [];
    }
    try {
      const tagOrderField = this.getTagOrderField('C.Tag');
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Campo C LEFT JOIN Bib_Marc_Dic_Formato F ON C.Id_Formato = F.Id_Formato',
        fields: 'C.Id_Dic_Campo, C.Id_Formato, F.Nombre AS Formato, C.Tag, C.Nombre, C.Grupo, C.Repetibilidad, C.Es_Control, C.Es_Obsoleto, C.Orden',
        where: `C.Id_Formato = ${formatoId}`,
        orderField: tagOrderField,
        orderDirection: ' ASC ',
        Empresa: false,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Campo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          nombre: row.Nombre,
          grupo: row.Grupo || '',
          repetibilidad: row.Repetibilidad || undefined,
          esControl: Number(row.Es_Control || 0) === 1,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1,
          orden: row.Orden ? Number(row.Orden) : undefined
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getMarcDicCamposPage(
    formatoId: number | undefined,
    page: number,
    pageSize: number,
    tipoMaterialId?: number,
    tagFilter = ''
  ): Promise<{ campos: MarcDicCampo[]; total: number }> {
    try {
      const whereParts: string[] = [];
      const filter = this.escapeSql(tagFilter.trim());
      if (formatoId) {
        whereParts.push(`C.Id_Formato = ${formatoId}`);
      }
      if (filter) {
        whereParts.push(`(C.Tag LIKE '%${filter}%' OR C.Nombre LIKE '%${filter}%')`);
      }
      if (tipoMaterialId) {
        whereParts.push(
          `EXISTS (` +
          `SELECT 1 FROM Bib_Tipo_Material_Marc_Campo R ` +
          `WHERE R.Dic_Campo_Id = C.Id_Dic_Campo ` +
          `AND R.Tipo_Material_Id = ${tipoMaterialId} ` +
          `AND R.Id_Empresa = ${this.getEmpresaId()}` +
          `)`
        );
      }
      const whereClause = whereParts.join(' AND ');
      const tagOrderField = this.getTagOrderField('C.Tag');
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Campo C LEFT JOIN Bib_Marc_Dic_Formato F ON C.Id_Formato = F.Id_Formato',
        fields: 'C.Id_Dic_Campo, C.Id_Formato, F.Nombre AS Formato, C.Tag, C.Nombre, C.Grupo, C.Repetibilidad, C.Es_Control, C.Es_Obsoleto, C.Orden',
        orderField: tagOrderField,
        orderDirection: ' ASC ',
        Empresa: false,
        where: whereClause,
        paginacion: {
          FirstRow: (page - 1) * pageSize + 1,
          LastRow: page * pageSize,
          TotalRows: 0
        }
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length) {
        const campos = data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Campo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          nombre: row.Nombre,
          grupo: row.Grupo || '',
          repetibilidad: row.Repetibilidad || undefined,
          esControl: Number(row.Es_Control || 0) === 1,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1,
          orden: row.Orden ? Number(row.Orden) : undefined
        }));
        const total = Number(data?.paginacion?.TotalRows || data['total'] || campos.length);
        return { campos, total };
      }
      const total = Number(data?.paginacion?.TotalRows || data?.['total'] || 0);
      return { campos: [], total };
    } catch (error) {
      console.error(error);
      return { campos: [], total: 0 };
    }
  }

  async countMarcDicCampos(formatoId: number | undefined, tipoMaterialId?: number, tagFilter = ''): Promise<number> {
    try {
      const whereParts: string[] = [];
      const filter = this.escapeSql(tagFilter.trim());
      if (formatoId) {
        whereParts.push(`C.Id_Formato = ${formatoId}`);
      }
      if (filter) {
        whereParts.push(`(C.Tag LIKE '%${filter}%' OR C.Nombre LIKE '%${filter}%')`);
      }
      if (tipoMaterialId) {
        whereParts.push(
          `EXISTS (` +
          `SELECT 1 FROM Bib_Tipo_Material_Marc_Campo R ` +
          `WHERE R.Dic_Campo_Id = C.Id_Dic_Campo ` +
          `AND R.Tipo_Material_Id = ${tipoMaterialId} ` +
          `AND R.Id_Empresa = ${this.getEmpresaId()}` +
          `)`
        );
      }
      const whereClause = whereParts.join(' AND ');
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Campo C',
        fields: 'COUNT(*) AS total',
        where: whereClause,
        simple: true,
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return Number(data['data'][0].total || 0);
      }
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async createMarcDicCampo(item: MarcDicCampo): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Dic_Campo',
      fields: 'Id_Formato,Tag,Nombre,Grupo,Repetibilidad,Es_Control,Es_Obsoleto,Orden',
      values: `${item.formatoId},'${this.escapeSql(item.tag)}','${this.escapeSql(item.nombre)}',` +
        `'${this.escapeSql(item.grupo || '')}',${item.repetibilidad ? `'${this.escapeSql(item.repetibilidad)}'` : 'NULL'},` +
        `${item.esControl ? 1 : 0},${item.esObsoleto ? 1 : 0},${item.orden != null ? item.orden : 'NULL'}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateMarcDicCampo(item: MarcDicCampo): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Dic_Campo',
      fields: `Id_Formato=${item.formatoId},Tag='${this.escapeSql(item.tag)}',Nombre='${this.escapeSql(item.nombre)}',` +
        `Grupo='${this.escapeSql(item.grupo || '')}',` +
        `Repetibilidad=${item.repetibilidad ? `'${this.escapeSql(item.repetibilidad)}'` : 'NULL'},` +
        `Es_Control=${item.esControl ? 1 : 0},Es_Obsoleto=${item.esObsoleto ? 1 : 0},Orden=${item.orden != null ? item.orden : 'NULL'}`,
      where: 'Id_Dic_Campo=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteMarcDicCampo(id: number): Promise<any> {
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Marc_Dic_Campo WHERE Id_Dic_Campo=${id}`
    );
  }

  async getMarcDicSubcampos(): Promise<MarcDicSubcampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Subcampo S LEFT JOIN Bib_Marc_Dic_Formato F ON S.Id_Formato = F.Id_Formato',
        fields: 'S.Id_Dic_Subcampo, S.Id_Formato, F.Nombre AS Formato, S.Tag, S.Codigo, S.Nombre, S.Repetibilidad, S.Es_Obsoleto',
        orderField: 'S.Tag, S.Codigo',
        orderDirection: ' ASC ',
        simple: true,
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Subcampo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          codigo: row.Codigo,
          nombre: row.Nombre,
          repetibilidad: row.Repetibilidad || undefined,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createMarcDicSubcampo(item: MarcDicSubcampo): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Dic_Subcampo',
      fields: 'Id_Formato,Tag,Codigo,Nombre,Repetibilidad,Es_Obsoleto',
      values: `${item.formatoId},'${this.escapeSql(item.tag)}','${this.escapeSql(item.codigo)}',` +
        `'${this.escapeSql(item.nombre)}',${item.repetibilidad ? `'${this.escapeSql(item.repetibilidad)}'` : 'NULL'},` +
        `${item.esObsoleto ? 1 : 0}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateMarcDicSubcampo(item: MarcDicSubcampo): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Dic_Subcampo',
      fields: `Id_Formato=${item.formatoId},Tag='${this.escapeSql(item.tag)}',Codigo='${this.escapeSql(item.codigo)}',` +
        `Nombre='${this.escapeSql(item.nombre)}',` +
        `Repetibilidad=${item.repetibilidad ? `'${this.escapeSql(item.repetibilidad)}'` : 'NULL'},` +
        `Es_Obsoleto=${item.esObsoleto ? 1 : 0}`,
      where: 'Id_Dic_Subcampo=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteMarcDicSubcampo(id: number): Promise<any> {
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Marc_Dic_Subcampo WHERE Id_Dic_Subcampo=${id}`
    );
  }

  async getMarcDicIndicadores(): Promise<MarcDicIndicador[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Indicador I LEFT JOIN Bib_Marc_Dic_Formato F ON I.Id_Formato = F.Id_Formato',
        fields: 'I.Id_Dic_Indicador, I.Id_Formato, F.Nombre AS Formato, I.Tag, I.Posicion, I.Valor, I.Significado',
        orderField: 'I.Tag, I.Posicion, I.Valor',
        orderDirection: ' ASC ',
        simple: true,
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Indicador),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          posicion: Number(row.Posicion),
          valor: row.Valor,
          significado: row.Significado
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createMarcDicIndicador(item: MarcDicIndicador): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Dic_Indicador',
      fields: 'Id_Formato,Tag,Posicion,Valor,Significado',
      values: `${item.formatoId},'${this.escapeSql(item.tag)}',${item.posicion},` +
        `'${this.escapeSql(item.valor)}','${this.escapeSql(item.significado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateMarcDicIndicador(item: MarcDicIndicador): Promise<any> {
    const sql = {
      table: 'Bib_Marc_Dic_Indicador',
      fields: `Id_Formato=${item.formatoId},Tag='${this.escapeSql(item.tag)}',Posicion=${item.posicion},` +
        `Valor='${this.escapeSql(item.valor)}',Significado='${this.escapeSql(item.significado)}'`,
      where: 'Id_Dic_Indicador=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteMarcDicIndicador(id: number): Promise<any> {
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Marc_Dic_Indicador WHERE Id_Dic_Indicador=${id}`
    );
  }

  async getMarcDicIndicadoresPorTag(formatoId: number, tag: string): Promise<MarcDicIndicador[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Indicador I LEFT JOIN Bib_Marc_Dic_Formato F ON I.Id_Formato = F.Id_Formato',
        fields: 'I.Id_Dic_Indicador, I.Id_Formato, F.Nombre AS Formato, I.Tag, I.Posicion, I.Valor, I.Significado',
        where: `I.Id_Formato=${formatoId} AND I.Tag='${this.escapeSql(tag)}'`,
        orderField: 'I.Posicion, I.Valor',
        orderDirection: ' ASC ',
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Indicador),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          posicion: Number(row.Posicion),
          valor: row.Valor,
          significado: row.Significado
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAutoridades(): Promise<Autoridad[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad A LEFT JOIN Bib_Autor AU ON AU.Id_Autor = A.Autor_Id',
        fields: 'A.Id_Autoridad, A.Tipo, A.Encabezado, A.Formato, A.Autor_Id, AU.Nombre AS Autor_Nombre',
        orderField: 'A.Encabezado',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Autoridad),
          tipo: row.Tipo,
          encabezado: row.Encabezado,
          formato: row.Formato,
          autorId: row.Autor_Id ? Number(row.Autor_Id) : undefined,
          autorNombre: row.Autor_Nombre || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAutoridadPorAutor(autorId: number): Promise<Autoridad | undefined> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad A LEFT JOIN Bib_Autor AU ON AU.Id_Autor = A.Autor_Id',
        fields: 'A.Id_Autoridad, A.Tipo, A.Encabezado, A.Formato, A.Autor_Id, AU.Nombre AS Autor_Nombre',
        where: `A.Autor_Id=${autorId}`,
        orderField: 'A.Id_Autoridad',
        orderDirection: ' DESC ',
        Empresa: true,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        const row = data['data'][0];
        return {
          id: Number(row.Id_Autoridad),
          tipo: row.Tipo,
          encabezado: row.Encabezado,
          formato: row.Formato,
          autorId: row.Autor_Id ? Number(row.Autor_Id) : undefined,
          autorNombre: row.Autor_Nombre || ''
        };
      }
      return undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async buscarAutoridadPorEtiqueta(texto: string): Promise<Autoridad[]> {
    const termino = this.escapeSql(texto.trim());
    if (!termino) return [];
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad A ' +
          'INNER JOIN Bib_Autoridad_Campo C ON C.Autoridad_Id = A.Id_Autoridad AND C.Tag IN (\'100\',\'400\',\'500\') ' +
          'LEFT JOIN Bib_Autor AU ON AU.Id_Autor = A.Autor_Id',
        fields: 'DISTINCT A.Id_Autoridad, A.Tipo, A.Encabezado, A.Formato, A.Autor_Id, AU.Nombre AS Autor_Nombre',
        where: `C.Valor LIKE '%${termino}%'`,
        orderField: 'A.Encabezado',
        orderDirection: ' ASC ',
        Empresa: true,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Autoridad),
          tipo: row.Tipo,
          encabezado: row.Encabezado,
          formato: row.Formato,
          autorId: row.Autor_Id ? Number(row.Autor_Id) : undefined,
          autorNombre: row.Autor_Nombre || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createAutoridad(item: Autoridad): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad',
      fields: 'Tipo,Encabezado,Formato,Autor_Id',
      values: `'${this.escapeSql(item.tipo)}','${this.escapeSql(item.encabezado)}','${this.escapeSql(item.formato)}',${item.autorId || 'NULL'}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateAutoridad(item: Autoridad): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad',
      fields: `Tipo='${this.escapeSql(item.tipo)}',Encabezado='${this.escapeSql(item.encabezado)}',` +
        `Formato='${this.escapeSql(item.formato)}',Autor_Id=${item.autorId || 'NULL'}`,
      where: 'Id_Autoridad=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteAutoridad(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Autoridad WHERE Id_Autoridad=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getAutoridadCampos(options?: { autoridadId?: number; libroId?: number; tags?: string[] }): Promise<AutoridadCampo[]> {
    try {
    const fields = ['Id_Autoridad_Campo', 'Autoridad_Id', 'Tag', 'Ind1', 'Ind2', 'Valor', 'Libro_Id'];
    const sqlConfig: {
      table: string;
      fields: string;
      orderField: string;
      orderDirection: string;
      Empresa: boolean;
      simple?: boolean;
      where?: string;
    } = {
      table: 'Bib_Autoridad_Campo',
      fields: fields.join(', '),
      orderField: 'Id_Autoridad_Campo',
      orderDirection: ' DESC ',
      simple: true,
      Empresa: true
    };
    const whereClauses: string[] = [];
    if (options?.autoridadId) {
      whereClauses.push(`Autoridad_Id = ${options.autoridadId}`);
    }
    if (options?.libroId) {
      whereClauses.push(`Libro_Id = ${options.libroId}`);
    }
      if (options?.tags && options.tags.length) {
        const list = options.tags.map(tag => `'${this.escapeSql(tag)}'`).join(',');
        whereClauses.push(`Tag IN (${list})`);
      }
      if (whereClauses.length) {
        sqlConfig.where = whereClauses.join(' AND ');
      }
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Autoridad_Campo),
          autoridadId: Number(row.Autoridad_Id),
          libroId: row.Libro_Id ? Number(row.Libro_Id) : undefined,
          tag: row.Tag,
          ind1: row.Ind1 || '',
          ind2: row.Ind2 || '',
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }


  async getAutoridadCamposPage(autoridadId: number | undefined, page: number, pageSize: number): Promise<{ campos: AutoridadCampo[]; total: number }> {
    try {
      const whereClause = autoridadId ? `Autoridad_Id = ${autoridadId}` : '';
      const fields = ['Id_Autoridad_Campo', 'Autoridad_Id', 'Tag', 'Ind1', 'Ind2', 'Valor', 'Libro_Id'];
      const sqlConfig: any = {
        table: 'Bib_Autoridad_Campo',
        fields: fields.join(', '),
        orderField: 'Id_Autoridad_Campo',
        orderDirection: ' ASC ',
        Empresa: true,
        where: whereClause,
        paginacion: {
          FirstRow: (page - 1) * pageSize + 1,
          LastRow: page * pageSize,
          TotalRows: 0
        }
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data']) {
        const campos = data['data'].map((row: any) => ({
          id: Number(row.Id_Autoridad_Campo),
          autoridadId: Number(row.Autoridad_Id),
          libroId: row.Libro_Id ? Number(row.Libro_Id) : undefined,
          tag: row.Tag,
          ind1: row.Ind1 || '',
          ind2: row.Ind2 || '',
          valor: row.Valor || ''
        }));
        const total = Number(data?.paginacion?.TotalRows || data['total'] || campos.length);
        return { campos, total };
      }
      const total = Number(data?.paginacion?.TotalRows || data?.['total'] || 0);
      return { campos: [], total };
    } catch (error) {
      console.error(error);
      return { campos: [], total: 0 };
    }
  }

  async getAutoridadCampoByTag(autoridadId: number, tag: string, libroId?: number): Promise<AutoridadCampo | undefined> {
    try {
      const baseWhere = `Autoridad_Id = ${autoridadId} AND Tag='${this.escapeSql(tag)}'`;
      const whereClause = libroId ? `${baseWhere} AND Libro_Id=${libroId}` : baseWhere;
      const fields = ['Id_Autoridad_Campo', 'Autoridad_Id', 'Tag', 'Ind1', 'Ind2', 'Valor', 'Libro_Id'];
      const sqlConfig: any = {
        table: 'Bib_Autoridad_Campo',
        fields: fields.join(', '),
        where: whereClause,
        orderField: 'Id_Autoridad_Campo',
        orderDirection: ' DESC ',
        Empresa: true,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length) {
        const row = data['data'][0];
        return {
          id: Number(row.Id_Autoridad_Campo),
          autoridadId: Number(row.Autoridad_Id),
          libroId: row.Libro_Id ? Number(row.Libro_Id) : undefined,
          tag: row.Tag,
          ind1: row.Ind1 || '',
          ind2: row.Ind2 || '',
          valor: row.Valor || ''
        };
      }
      return undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getMarcCamposByRegistroAndTags(registroId: number, tags: string[]): Promise<MarcCampo[]> {
    if (!registroId || tags.length === 0) {
      return [];
    }
    const tagsList = tags.map(tag => `'${this.escapeSql(tag)}'`).join(',');
    const sqlConfig = {
      table: 'Bib_Marc_Campo',
      fields: 'Id_Marc_Campo, Marc_Registro_Id, Tag, Ind1, Ind2, Valor',
      where: `Marc_Registro_Id=${registroId} AND Tag IN (${tagsList})`,
      orderField: 'Id_Marc_Campo',
      orderDirection: ' DESC ',
      Empresa: true,
      simple: true
    };
    try {
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Marc_Campo),
          marcRegistroId: Number(row.Marc_Registro_Id),
          tag: row.Tag,
          ind1: row.Ind1 || '',
          ind2: row.Ind2 || '',
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getMarcCamposByRegistro(registroId: number): Promise<MarcCampo[]> {
    if (!registroId) {
      return [];
    }
    const sqlConfig = {
      table: 'Bib_Marc_Campo',
      fields: 'Id_Marc_Campo, Marc_Registro_Id, Tag, Ind1, Ind2, Valor',
      where: `Marc_Registro_Id=${registroId}`,
      orderField: this.getTagOrderField('Tag') + ', Id_Marc_Campo',
      orderDirection: ' ASC ',
      Empresa: true,
      simple: true
    };
    try {
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Marc_Campo),
          marcRegistroId: Number(row.Marc_Registro_Id),
          tag: row.Tag,
          ind1: row.Ind1 || '',
          ind2: row.Ind2 || '',
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAutoridadSubcamposByCampo(campoId: number): Promise<AutoridadSubcampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad_Subcampo',
        fields: 'Id_Autoridad_Subcampo, Autoridad_Campo_Id, Codigo, Valor',
        where: `Autoridad_Campo_Id=${campoId}`,
        orderField: 'Id_Autoridad_Subcampo',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Autoridad_Subcampo),
          autoridadCampoId: Number(row.Autoridad_Campo_Id),
          codigo: row.Codigo,
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAutoridadSubcamposByCampos(campoIds: number[]): Promise<AutoridadSubcampo[]> {
    if (campoIds.length === 0) {
      return [];
    }
    try {
      const ids = Array.from(new Set(campoIds.filter(id => Number(id) > 0)));
      if (ids.length === 0) {
        return [];
      }
      const sqlConfig = {
        table: 'Bib_Autoridad_Subcampo',
        fields: 'Id_Autoridad_Subcampo, Autoridad_Campo_Id, Codigo, Valor',
        where: `Autoridad_Campo_Id IN (${ids.join(',')})`,
        orderField: 'Id_Autoridad_Subcampo',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Autoridad_Subcampo),
          autoridadCampoId: Number(row.Autoridad_Campo_Id),
          codigo: row.Codigo,
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAutoridadDicFormatos(): Promise<AutoridadDicFormato[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Formato',
        fields: 'Id_Formato, Codigo, Nombre, Fuente, Version, URL_Fuente, Activo',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Formato),
          codigo: row.Codigo,
          nombre: row.Nombre,
          fuente: row.Fuente || '',
          version: row.Version || '',
          urlFuente: row.URL_Fuente || '',
          activo: Number(row.Activo || 0) === 1
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createAutoridadDicFormato(item: AutoridadDicFormato): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Dic_Formato',
      fields: 'Codigo,Nombre,Fuente,Version,URL_Fuente,Activo',
      values: `'${this.escapeSql(item.codigo)}','${this.escapeSql(item.nombre)}',` +
        `'${this.escapeSql(item.fuente || '')}','${this.escapeSql(item.version || '')}',` +
        `'${this.escapeSql(item.urlFuente || '')}',${item.activo ? 1 : 0}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateAutoridadDicFormato(item: AutoridadDicFormato): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Dic_Formato',
      fields: `Codigo='${this.escapeSql(item.codigo)}',Nombre='${this.escapeSql(item.nombre)}',` +
        `Fuente='${this.escapeSql(item.fuente || '')}',Version='${this.escapeSql(item.version || '')}',` +
        `URL_Fuente='${this.escapeSql(item.urlFuente || '')}',Activo=${item.activo ? 1 : 0}`,
      where: 'Id_Formato=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteAutoridadDicFormato(id: number): Promise<any> {
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Autoridad_Dic_Formato WHERE Id_Formato=${id}`
    );
  }

  async getAutoridadDicCamposPage(formatoId: number | undefined, page: number, pageSize: number): Promise<{ campos: AutoridadDicCampo[]; total: number }> {
    try {
      const whereClause = formatoId ? `C.Id_Formato = ${formatoId}` : '';
      const tagOrderField = this.getTagOrderField('C.Tag');
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Campo C LEFT JOIN Bib_Autoridad_Dic_Formato F ON C.Id_Formato = F.Id_Formato',
        fields: 'C.Id_Dic_Campo, C.Id_Formato, F.Nombre AS Formato, C.Tag, C.Nombre, C.Grupo, C.Repetibilidad, C.Es_Control, C.Es_Obsoleto, C.Orden',
        orderField: tagOrderField,
        orderDirection: ' ASC ',
        Empresa: true,
        where: whereClause,
        paginacion: {
          FirstRow: (page - 1) * pageSize + 1,
          LastRow: page * pageSize,
          TotalRows: 0
        }
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length) {
        const campos = data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Campo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          nombre: row.Nombre,
          grupo: row.Grupo || '',
          repetibilidad: row.Repetibilidad || undefined,
          esControl: Number(row.Es_Control || 0) === 1,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1,
          orden: row.Orden ? Number(row.Orden) : undefined
        }));
        const total = Number(data?.paginacion?.TotalRows || data['total'] || campos.length);
        return { campos, total };
      }
      const total = Number(data?.paginacion?.TotalRows || data?.['total'] || 0);
      return { campos: [], total };
    } catch (error) {
      console.error(error);
      return { campos: [], total: 0 };
    }
  }

  async countAutoridadDicCampos(formatoId: number | undefined): Promise<number> {
    try {
      const whereClause = formatoId ? `C.Id_Formato = ${formatoId}` : '';
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Campo C',
        fields: 'COUNT(*) AS total',
        where: whereClause,
        simple: true,
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return Number(data['data'][0].total || 0);
      }
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async createAutoridadDicCampo(item: AutoridadDicCampo): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Dic_Campo',
      fields: 'Id_Formato,Tag,Nombre,Grupo,Repetibilidad,Es_Control,Es_Obsoleto,Orden',
      values: `${item.formatoId},'${this.escapeSql(item.tag)}','${this.escapeSql(item.nombre)}',` +
        `'${this.escapeSql(item.grupo || '')}',${item.repetibilidad ? `'${this.escapeSql(item.repetibilidad)}'` : 'NULL'},` +
        `${item.esControl ? 1 : 0},${item.esObsoleto ? 1 : 0},${item.orden != null ? item.orden : 'NULL'}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateAutoridadDicCampo(item: AutoridadDicCampo): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Dic_Campo',
      fields: `Id_Formato=${item.formatoId},Tag='${this.escapeSql(item.tag)}',Nombre='${this.escapeSql(item.nombre)}',` +
        `Grupo='${this.escapeSql(item.grupo || '')}',` +
        `Repetibilidad=${item.repetibilidad ? `'${this.escapeSql(item.repetibilidad)}'` : 'NULL'},` +
        `Es_Control=${item.esControl ? 1 : 0},Es_Obsoleto=${item.esObsoleto ? 1 : 0},Orden=${item.orden != null ? item.orden : 'NULL'}`,
      where: 'Id_Dic_Campo=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteAutoridadDicCampo(id: number): Promise<any> {
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Autoridad_Dic_Campo WHERE Id_Dic_Campo=${id}`
    );
  }

  async getAutoridadDicSubcampos(): Promise<AutoridadDicSubcampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Subcampo S LEFT JOIN Bib_Autoridad_Dic_Formato F ON S.Id_Formato = F.Id_Formato',
        fields: 'S.Id_Dic_Subcampo, S.Id_Formato, F.Nombre AS Formato, S.Tag, S.Codigo, S.Nombre, S.Repetibilidad, S.Es_Obsoleto',
        orderField: 'S.Id_Dic_Subcampo',
        orderDirection: ' ASC ',
        simple: true,
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Subcampo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          codigo: row.Codigo,
          nombre: row.Nombre,
          repetibilidad: row.Repetibilidad || undefined,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createAutoridadDicSubcampo(item: AutoridadDicSubcampo): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Dic_Subcampo',
      fields: 'Id_Formato,Tag,Codigo,Nombre,Repetibilidad,Es_Obsoleto',
      values: `${item.formatoId},'${this.escapeSql(item.tag)}','${this.escapeSql(item.codigo)}',` +
        `'${this.escapeSql(item.nombre)}',${item.repetibilidad ? `'${this.escapeSql(item.repetibilidad)}'` : 'NULL'},` +
        `${item.esObsoleto ? 1 : 0}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateAutoridadDicSubcampo(item: AutoridadDicSubcampo): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Dic_Subcampo',
      fields: `Id_Formato=${item.formatoId},Tag='${this.escapeSql(item.tag)}',Codigo='${this.escapeSql(item.codigo)}',` +
        `Nombre='${this.escapeSql(item.nombre)}',` +
        `Repetibilidad=${item.repetibilidad ? `'${this.escapeSql(item.repetibilidad)}'` : 'NULL'},` +
        `Es_Obsoleto=${item.esObsoleto ? 1 : 0}`,
      where: 'Id_Dic_Subcampo=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteAutoridadDicSubcampo(id: number): Promise<any> {
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Autoridad_Dic_Subcampo WHERE Id_Dic_Subcampo=${id}`
    );
  }

  async getAutoridadDicSubcamposPorTag(formatoId: number, tag: string): Promise<AutoridadDicSubcampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Subcampo S LEFT JOIN Bib_Autoridad_Dic_Formato F ON S.Id_Formato = F.Id_Formato',
        fields: 'S.Id_Dic_Subcampo, S.Id_Formato, F.Nombre AS Formato, S.Tag, S.Codigo, S.Nombre, S.Repetibilidad, S.Es_Obsoleto',
        where: `S.Id_Formato=${formatoId} AND S.Tag='${this.escapeSql(tag)}'`,
        orderField: 'S.Codigo',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Subcampo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          codigo: row.Codigo,
          nombre: row.Nombre,
          repetibilidad: row.Repetibilidad || undefined,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAutoridadDicSubcamposPorTags(formatoId: number, tags: string[]): Promise<AutoridadDicSubcampo[]> {
    if (!formatoId || !tags?.length) {
      return [];
    }
    try {
      const tagsList = tags.map(tag => `'${this.escapeSql(tag)}'`).join(',');
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Subcampo S LEFT JOIN Bib_Autoridad_Dic_Formato F ON S.Id_Formato = F.Id_Formato',
        fields: 'S.Id_Dic_Subcampo, S.Id_Formato, F.Nombre AS Formato, S.Tag, S.Codigo, S.Nombre, S.Repetibilidad, S.Es_Obsoleto',
        where: `S.Id_Formato=${formatoId} AND S.Tag IN (${tagsList})`,
        orderField: 'S.Tag, S.Codigo',
        orderDirection: ' ASC ',
        Empresa: true,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Subcampo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          codigo: row.Codigo,
          nombre: row.Nombre,
          repetibilidad: row.Repetibilidad || undefined,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAutoridadDicIndicadores(): Promise<AutoridadDicIndicador[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Indicador I LEFT JOIN Bib_Autoridad_Dic_Formato F ON I.Id_Formato = F.Id_Formato',
        fields: 'I.Id_Dic_Indicador, I.Id_Formato, F.Nombre AS Formato, I.Tag, I.Posicion, I.Valor, I.Significado',
        orderField: 'I.Id_Dic_Indicador',
        orderDirection: ' ASC ',
        simple: true,
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Indicador),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          posicion: Number(row.Posicion),
          valor: row.Valor,
          significado: row.Significado
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createAutoridadDicIndicador(item: AutoridadDicIndicador): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Dic_Indicador',
      fields: 'Id_Formato,Tag,Posicion,Valor,Significado',
      values: `${item.formatoId},'${this.escapeSql(item.tag)}',${item.posicion},` +
        `'${this.escapeSql(item.valor)}','${this.escapeSql(item.significado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateAutoridadDicIndicador(item: AutoridadDicIndicador): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Dic_Indicador',
      fields: `Id_Formato=${item.formatoId},Tag='${this.escapeSql(item.tag)}',Posicion=${item.posicion},` +
        `Valor='${this.escapeSql(item.valor)}',Significado='${this.escapeSql(item.significado)}'`,
      where: 'Id_Dic_Indicador=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteAutoridadDicIndicador(id: number): Promise<any> {
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Autoridad_Dic_Indicador WHERE Id_Dic_Indicador=${id}`
    );
  }

  async getAutoridadDicIndicadoresPorTag(formatoId: number, tag: string): Promise<AutoridadDicIndicador[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Indicador I LEFT JOIN Bib_Autoridad_Dic_Formato F ON I.Id_Formato = F.Id_Formato',
        fields: 'I.Id_Dic_Indicador, I.Id_Formato, F.Nombre AS Formato, I.Tag, I.Posicion, I.Valor, I.Significado',
        where: `I.Id_Formato=${formatoId} AND I.Tag='${this.escapeSql(tag)}'`,
        orderField: 'I.Posicion, I.Valor',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Indicador),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          posicion: Number(row.Posicion),
          valor: row.Valor,
          significado: row.Significado
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getAutoridadDicIndicadoresPorTags(formatoId: number, tags: string[]): Promise<AutoridadDicIndicador[]> {
    if (!formatoId || !tags?.length) {
      return [];
    }
    try {
      const tagsList = tags.map(tag => `'${this.escapeSql(tag)}'`).join(',');
      const sqlConfig = {
        table: 'Bib_Autoridad_Dic_Indicador I LEFT JOIN Bib_Autoridad_Dic_Formato F ON I.Id_Formato = F.Id_Formato',
        fields: 'I.Id_Dic_Indicador, I.Id_Formato, F.Nombre AS Formato, I.Tag, I.Posicion, I.Valor, I.Significado',
        where: `I.Id_Formato=${formatoId} AND I.Tag IN (${tagsList})`,
        orderField: 'I.Tag, I.Posicion, I.Valor',
        orderDirection: ' ASC ',
        Empresa: true,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Indicador),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          posicion: Number(row.Posicion),
          valor: row.Valor,
          significado: row.Significado
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async countAutoridadCampos(autoridadId: number | undefined): Promise<number> {
    try {
      const whereClause = autoridadId ? `Autoridad_Id = ${autoridadId}` : '';
      const sqlConfig = {
        table: 'Bib_Autoridad_Campo',
        fields: 'COUNT(*) AS total',
        where: whereClause,
        simple: true,
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['data'] && data['data'].length > 0) {
        return Number(data['data'][0].total || 0);
      }
      return 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
  async createAutoridadCampo(item: AutoridadCampo): Promise<any> {
    const fields = ['Autoridad_Id', 'Tag', 'Ind1', 'Ind2', 'Valor', 'Libro_Id'];
    const values = [
      `${item.autoridadId}`,
      `'${this.escapeSql(item.tag)}'`,
      `'${this.escapeSql(item.ind1 || '')}'`,
      `'${this.escapeSql(item.ind2 || '')}'`,
      `'${this.escapeSql(item.valor || '')}'`,
      item.libroId ? `${item.libroId}` : 'NULL'
    ];
    const sql = {
      table: 'Bib_Autoridad_Campo',
      fields: fields.join(','),
      values: values.join(',')
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateAutoridadCampo(item: AutoridadCampo): Promise<any> {
    const fieldParts = [
      `Autoridad_Id=${item.autoridadId}`,
      `Tag='${this.escapeSql(item.tag)}'`,
      `Ind1='${this.escapeSql(item.ind1 || '')}'`,
      `Ind2='${this.escapeSql(item.ind2 || '')}'`,
      `Valor='${this.escapeSql(item.valor || '')}'`,
      `Libro_Id=${item.libroId ?? 'NULL'}`
    ];
    const sql = {
      table: 'Bib_Autoridad_Campo',
      fields: fieldParts.join(','),
      where: 'Id_Autoridad_Campo=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteAutoridadCampo(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Autoridad_Campo WHERE Id_Autoridad_Campo=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getAutoridadSubcampos(): Promise<AutoridadSubcampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Autoridad_Subcampo',
        fields: 'Id_Autoridad_Subcampo, Autoridad_Campo_Id, Codigo, Valor',
        orderField: 'Id_Autoridad_Subcampo',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Autoridad_Subcampo),
          autoridadCampoId: Number(row.Autoridad_Campo_Id),
          codigo: row.Codigo,
          valor: row.Valor || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createAutoridadSubcampo(item: AutoridadSubcampo): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Subcampo',
      fields: 'Autoridad_Campo_Id,Codigo,Valor',
      values: `${item.autoridadCampoId},'${this.escapeSql(item.codigo)}','${this.escapeSql(item.valor)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateAutoridadSubcampo(item: AutoridadSubcampo): Promise<any> {
    const sql = {
      table: 'Bib_Autoridad_Subcampo',
      fields: `Autoridad_Campo_Id=${item.autoridadCampoId},Codigo='${this.escapeSql(item.codigo)}',Valor='${this.escapeSql(item.valor)}'`,
      where: 'Id_Autoridad_Subcampo=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteAutoridadSubcampo(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Autoridad_Subcampo WHERE Id_Autoridad_Subcampo=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getOpacComentarios(): Promise<OpacComentario[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Opac_Comentario C INNER JOIN Seg_Usuario U ON C.Usuario_Id = U.Id_Usuario',
        fields: 'C.Id_Opac_Comentario, C.Libro_Id, C.Usuario_Id, U.Nombre AS Usuario, C.Calificacion, C.Comentario, C.Estado, C.Creado_El',
        orderField: 'C.Creado_El',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Opac_Comentario),
          libroId: Number(row.Libro_Id),
          usuarioId: Number(row.Usuario_Id),
          usuarioNombre: row.Usuario,
          calificacion: row.Calificacion ? Number(row.Calificacion) : undefined,
          comentario: row.Comentario || '',
          estado: row.Estado || '',
          creadoEl: row.Creado_El || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createOpacComentario(item: OpacComentario): Promise<any> {
    const sql = {
      table: 'Bib_Opac_Comentario',
      fields: 'Libro_Id,Usuario_Id,Calificacion,Comentario,Estado',
      values: `${item.libroId},${item.usuarioId},${item.calificacion || 'NULL'},` +
        `'${this.escapeSql(item.comentario)}','${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateOpacComentario(item: OpacComentario): Promise<any> {
    const sql = {
      table: 'Bib_Opac_Comentario',
      fields: `Libro_Id=${item.libroId},Usuario_Id=${item.usuarioId},Calificacion=${item.calificacion || 'NULL'},` +
        `Comentario='${this.escapeSql(item.comentario)}',Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Opac_Comentario=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteOpacComentario(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Opac_Comentario WHERE Id_Opac_Comentario=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getOpacEtiquetas(): Promise<OpacEtiqueta[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Opac_Etiqueta',
        fields: 'Id_Opac_Etiqueta, Libro_Id, Usuario_Id, Etiqueta, Creado_El',
        orderField: 'Creado_El',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Opac_Etiqueta),
          libroId: Number(row.Libro_Id),
          usuarioId: Number(row.Usuario_Id),
          etiqueta: row.Etiqueta,
          creadoEl: row.Creado_El || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createOpacEtiqueta(item: OpacEtiqueta): Promise<any> {
    const sql = {
      table: 'Bib_Opac_Etiqueta',
      fields: 'Libro_Id,Usuario_Id,Etiqueta',
      values: `${item.libroId},${item.usuarioId},'${this.escapeSql(item.etiqueta)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async deleteOpacEtiqueta(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Opac_Etiqueta WHERE Id_Opac_Etiqueta=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getOpacListas(): Promise<OpacLista[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Opac_Lista',
        fields: 'Id_Opac_Lista, Usuario_Id, Nombre, Descripcion',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Opac_Lista),
          usuarioId: Number(row.Usuario_Id),
          nombre: row.Nombre,
          descripcion: row.Descripcion || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createOpacLista(item: OpacLista): Promise<any> {
    const sql = {
      table: 'Bib_Opac_Lista',
      fields: 'Usuario_Id,Nombre,Descripcion',
      values: `${item.usuarioId},'${this.escapeSql(item.nombre)}','${this.escapeSql(item.descripcion)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateOpacLista(item: OpacLista): Promise<any> {
    const sql = {
      table: 'Bib_Opac_Lista',
      fields: `Usuario_Id=${item.usuarioId},Nombre='${this.escapeSql(item.nombre)}',Descripcion='${this.escapeSql(item.descripcion)}'`,
      where: 'Id_Opac_Lista=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteOpacLista(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Opac_Lista WHERE Id_Opac_Lista=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getOpacListaItems(): Promise<OpacListaItem[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Opac_Lista_Item LI INNER JOIN Bib_Libro L ON LI.Libro_Id = L.Id_Libro',
        fields: 'LI.Id_Opac_Lista_Item, LI.Lista_Id, LI.Libro_Id, L.Titulo AS Libro',
        orderField: 'LI.Lista_Id',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Opac_Lista_Item),
          listaId: Number(row.Lista_Id),
          libroId: Number(row.Libro_Id),
          libroTitulo: row.Libro || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createOpacListaItem(item: OpacListaItem): Promise<any> {
    const sql = {
      table: 'Bib_Opac_Lista_Item',
      fields: 'Lista_Id,Libro_Id',
      values: `${item.listaId},${item.libroId}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async deleteOpacListaItem(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Opac_Lista_Item WHERE Id_Opac_Lista_Item=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getOpacHistorial(): Promise<OpacHistorialBusqueda[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Opac_Historial_Busqueda',
        fields: 'Id_Opac_Historial_Busqueda, Usuario_Id, Consulta, Creado_El',
        orderField: 'Creado_El',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Opac_Historial_Busqueda),
          usuarioId: Number(row.Usuario_Id),
          consulta: row.Consulta,
          creadoEl: row.Creado_El || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getProveedores(): Promise<ProveedorBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Proveedor',
        fields: 'Id_Proveedor, Nombre, Contacto, Telefono, Email, Direccion, Estado',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Proveedor),
          nombre: row.Nombre,
          contacto: row.Contacto || '',
          telefono: row.Telefono || '',
          email: row.Email || '',
          direccion: row.Direccion || '',
          estado: row.Estado || 'activo'
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createProveedor(item: ProveedorBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Proveedor',
      fields: 'Nombre,Contacto,Telefono,Email,Direccion,Estado',
      values: `'${this.escapeSql(item.nombre)}','${this.escapeSql(item.contacto)}','${this.escapeSql(item.telefono)}',` +
        `'${this.escapeSql(item.email)}','${this.escapeSql(item.direccion)}','${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateProveedor(item: ProveedorBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Proveedor',
      fields: `Nombre='${this.escapeSql(item.nombre)}',Contacto='${this.escapeSql(item.contacto)}',` +
        `Telefono='${this.escapeSql(item.telefono)}',Email='${this.escapeSql(item.email)}',` +
        `Direccion='${this.escapeSql(item.direccion)}',Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Proveedor=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteProveedor(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Proveedor WHERE Id_Proveedor=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getPresupuestos(): Promise<PresupuestoBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Presupuesto',
        fields: 'Id_Presupuesto, Nombre, Anio, Monto, Saldo, Estado',
        orderField: 'Anio',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Presupuesto),
          nombre: row.Nombre,
          anio: Number(row.Anio || 0),
          monto: Number(row.Monto || 0),
          saldo: Number(row.Saldo || 0),
          estado: row.Estado || 'activo'
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createPresupuesto(item: PresupuestoBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Presupuesto',
      fields: 'Nombre,Anio,Monto,Saldo,Estado',
      values: `'${this.escapeSql(item.nombre)}',${item.anio || 0},${item.monto || 0},${item.saldo || 0},` +
        `'${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updatePresupuesto(item: PresupuestoBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Presupuesto',
      fields: `Nombre='${this.escapeSql(item.nombre)}',Anio=${item.anio || 0},` +
        `Monto=${item.monto || 0},Saldo=${item.saldo || 0},Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Presupuesto=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deletePresupuesto(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Presupuesto WHERE Id_Presupuesto=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getOrdenesCompra(): Promise<OrdenCompraBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Orden_Compra OC ' +
          'LEFT JOIN Bib_Proveedor P ON OC.Proveedor_Id = P.Id_Proveedor ' +
          'LEFT JOIN Bib_Presupuesto B ON OC.Presupuesto_Id = B.Id_Presupuesto',
        fields: 'OC.Id_Orden_Compra, OC.Proveedor_Id, OC.Presupuesto_Id, P.Nombre AS Proveedor, B.Nombre AS Presupuesto,' +
          'OC.Fecha, OC.Estado, OC.Total, OC.Observaciones',
        orderField: 'OC.Fecha',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Orden_Compra),
          proveedorId: Number(row.Proveedor_Id),
          presupuestoId: row.Presupuesto_Id ? Number(row.Presupuesto_Id) : undefined,
          proveedorNombre: row.Proveedor || '',
          presupuestoNombre: row.Presupuesto || '',
          fecha: row.Fecha,
          estado: row.Estado || 'pendiente',
          total: Number(row.Total || 0),
          observaciones: row.Observaciones || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createOrdenCompra(item: OrdenCompraBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Orden_Compra',
      fields: 'Proveedor_Id,Presupuesto_Id,Fecha,Estado,Total,Observaciones',
      values: `${item.proveedorId},${item.presupuestoId || 'NULL'},'${item.fecha}',` +
        `'${this.escapeSql(item.estado)}',${item.total || 0},'${this.escapeSql(item.observaciones)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateOrdenCompra(item: OrdenCompraBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Orden_Compra',
      fields: `Proveedor_Id=${item.proveedorId},Presupuesto_Id=${item.presupuestoId || 'NULL'},` +
        `Fecha='${item.fecha}',Estado='${this.escapeSql(item.estado)}',Total=${item.total || 0},` +
        `Observaciones='${this.escapeSql(item.observaciones)}'`,
      where: 'Id_Orden_Compra=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteOrdenCompra(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Orden_Compra WHERE Id_Orden_Compra=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getOrdenesCompraDetalle(): Promise<OrdenCompraDetalleBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Orden_Compra_Detalle',
        fields: 'Id_Orden_Compra_Detalle, Orden_Compra_Id, Descripcion, Cantidad, Costo_Unitario, Subtotal',
        orderField: 'Id_Orden_Compra_Detalle',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Orden_Compra_Detalle),
          ordenCompraId: Number(row.Orden_Compra_Id),
          descripcion: row.Descripcion || '',
          cantidad: Number(row.Cantidad || 0),
          costoUnitario: Number(row.Costo_Unitario || 0),
          subtotal: Number(row.Subtotal || 0)
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createOrdenCompraDetalle(item: OrdenCompraDetalleBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Orden_Compra_Detalle',
      fields: 'Orden_Compra_Id,Descripcion,Cantidad,Costo_Unitario,Subtotal',
      values: `${item.ordenCompraId},'${this.escapeSql(item.descripcion)}',${item.cantidad || 0},` +
        `${item.costoUnitario || 0},${item.subtotal || 0}`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateOrdenCompraDetalle(item: OrdenCompraDetalleBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Orden_Compra_Detalle',
      fields: `Orden_Compra_Id=${item.ordenCompraId},Descripcion='${this.escapeSql(item.descripcion)}',` +
        `Cantidad=${item.cantidad || 0},Costo_Unitario=${item.costoUnitario || 0},Subtotal=${item.subtotal || 0}`,
      where: 'Id_Orden_Compra_Detalle=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteOrdenCompraDetalle(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Orden_Compra_Detalle WHERE Id_Orden_Compra_Detalle=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getFacturasCompra(): Promise<FacturaCompraBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Factura_Compra F LEFT JOIN Bib_Proveedor P ON F.Proveedor_Id = P.Id_Proveedor',
        fields: 'F.Id_Factura_Compra, F.Orden_Compra_Id, F.Proveedor_Id, P.Nombre AS Proveedor, F.Numero, F.Fecha, F.Total, F.Estado',
        orderField: 'F.Fecha',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Factura_Compra),
          ordenCompraId: row.Orden_Compra_Id ? Number(row.Orden_Compra_Id) : undefined,
          proveedorId: Number(row.Proveedor_Id),
          proveedorNombre: row.Proveedor || '',
          numero: row.Numero || '',
          fecha: row.Fecha,
          total: Number(row.Total || 0),
          estado: row.Estado || 'pendiente'
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createFacturaCompra(item: FacturaCompraBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Factura_Compra',
      fields: 'Orden_Compra_Id,Proveedor_Id,Numero,Fecha,Total,Estado',
      values: `${item.ordenCompraId || 'NULL'},${item.proveedorId},'${this.escapeSql(item.numero)}',` +
        `'${item.fecha}',${item.total || 0},'${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateFacturaCompra(item: FacturaCompraBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Factura_Compra',
      fields: `Orden_Compra_Id=${item.ordenCompraId || 'NULL'},Proveedor_Id=${item.proveedorId},` +
        `Numero='${this.escapeSql(item.numero)}',Fecha='${item.fecha}',Total=${item.total || 0},` +
        `Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Factura_Compra=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteFacturaCompra(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Factura_Compra WHERE Id_Factura_Compra=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getCotizaciones(): Promise<CotizacionBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Cotizacion C LEFT JOIN Bib_Proveedor P ON C.Proveedor_Id = P.Id_Proveedor',
        fields: 'C.Id_Cotizacion, C.Proveedor_Id, P.Nombre AS Proveedor, C.Descripcion, C.Fecha, C.Total, C.Estado',
        orderField: 'C.Fecha',
        orderDirection: ' DESC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Cotizacion),
          proveedorId: Number(row.Proveedor_Id),
          proveedorNombre: row.Proveedor || '',
          descripcion: row.Descripcion || '',
          fecha: row.Fecha,
          total: Number(row.Total || 0),
          estado: row.Estado || 'pendiente'
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createCotizacion(item: CotizacionBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Cotizacion',
      fields: 'Proveedor_Id,Descripcion,Fecha,Total,Estado',
      values: `${item.proveedorId},'${this.escapeSql(item.descripcion)}','${item.fecha}',` +
        `${item.total || 0},'${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateCotizacion(item: CotizacionBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Cotizacion',
      fields: `Proveedor_Id=${item.proveedorId},Descripcion='${this.escapeSql(item.descripcion)}',` +
        `Fecha='${item.fecha}',Total=${item.total || 0},Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Cotizacion=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteCotizacion(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Cotizacion WHERE Id_Cotizacion=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getSedes(): Promise<SedeBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Sede',
        fields: 'Id_Sede, Nombre, Codigo, Direccion, Telefono, Estado',
        orderField: 'Nombre',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Sede),
          nombre: row.Nombre,
          codigo: row.Codigo || '',
          direccion: row.Direccion || '',
          telefono: row.Telefono || '',
          estado: row.Estado || 'activo'
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createSede(item: SedeBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Sede',
      fields: 'Nombre,Codigo,Direccion,Telefono,Estado',
      values: `'${this.escapeSql(item.nombre)}','${this.escapeSql(item.codigo)}','${this.escapeSql(item.direccion)}',` +
        `'${this.escapeSql(item.telefono)}','${this.escapeSql(item.estado)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateSede(item: SedeBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Sede',
      fields: `Nombre='${this.escapeSql(item.nombre)}',Codigo='${this.escapeSql(item.codigo)}',` +
        `Direccion='${this.escapeSql(item.direccion)}',Telefono='${this.escapeSql(item.telefono)}',` +
        `Estado='${this.escapeSql(item.estado)}'`,
      where: 'Id_Sede=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteSede(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Sede WHERE Id_Sede=${id} AND Id_Empresa=${empresaId}`
    );
  }

  async getIntegraciones(): Promise<IntegracionBiblioteca[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Integracion',
        fields: 'Id_Integracion, Tipo, Endpoint, Usuario, Clave, Puerto, Estado, Notas',
        orderField: 'Tipo',
        orderDirection: ' ASC ',
        Empresa: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Integracion),
          tipo: row.Tipo,
          endpoint: row.Endpoint || '',
          usuario: row.Usuario || '',
          clave: row.Clave || '',
          puerto: row.Puerto ? Number(row.Puerto) : undefined,
          estado: row.Estado || 'activo',
          notas: row.Notas || ''
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createIntegracion(item: IntegracionBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Integracion',
      fields: 'Tipo,Endpoint,Usuario,Clave,Puerto,Estado,Notas',
      values: `'${this.escapeSql(item.tipo)}','${this.escapeSql(item.endpoint)}','${this.escapeSql(item.usuario)}',` +
        `'${this.escapeSql(item.clave)}',${item.puerto || 'NULL'},'${this.escapeSql(item.estado)}',` +
        `'${this.escapeSql(item.notas)}'`
    };
    return await this.apiService.insertRecord(sql);
  }

  async updateIntegracion(item: IntegracionBiblioteca): Promise<any> {
    const sql = {
      table: 'Bib_Integracion',
      fields: `Tipo='${this.escapeSql(item.tipo)}',Endpoint='${this.escapeSql(item.endpoint)}',` +
        `Usuario='${this.escapeSql(item.usuario)}',Clave='${this.escapeSql(item.clave)}',` +
        `Puerto=${item.puerto || 'NULL'},Estado='${this.escapeSql(item.estado)}',` +
        `Notas='${this.escapeSql(item.notas)}'`,
      where: 'Id_Integracion=' + item.id
    };
    return await this.apiService.updateRecord(sql);
  }

  async deleteIntegracion(id: number): Promise<any> {
    const empresaId = localStorage.getItem('Id_Empresa') || 1;
    return await this.apiService.postRecord(
      `DELETE FROM Bib_Integracion WHERE Id_Integracion=${id} AND Id_Empresa=${empresaId}`
    );
  }

  private async getUsuarioSistemaId(): Promise<number | null> {
    const idUsuario = Number(localStorage.getItem('Id_Usuario') || 0);
    return idUsuario || null;
  }

  async createReserva(libroId: number): Promise<any> {
    const usuarioId = await this.getUsuarioSistemaId();
    if (!usuarioId) {
      throw new Error('Usuario no encontrado');
    }

    const validacion = await this.validarSolicitudCirculacion(usuarioId);
    if (!validacion.ok) {
      throw new Error(validacion.motivo || 'El usuario no cumple con las politicas de circulacion');
    }

    const empresaId = this.getEmpresaId();
    const posicionData = await this.apiService.postRecord(
      `SELECT COALESCE(MAX(Posicion),0)+1 AS Posicion ` +
      `FROM Bib_Reserva ` +
      `WHERE Libro_Id=${libroId} AND Id_Empresa=${empresaId} ` +
      `AND ${this.getEstadosReservaBloqueantesSql()}`
    );
    const posicion = Math.max(1, this.getResponseTotal(posicionData, 'Posicion'));
    const sqlConfig = {
      table: 'Bib_Reserva',
      fields: 'Libro_Id,Usuario_Id,Posicion,Estado',
      values: `${libroId},${usuarioId},${posicion},'En espera'`
    };
    return await this.apiService.insertRecord(sqlConfig);
  }

  /** v2.2: prestamo directo desde OPAC (cards de resultados / ficha), sin pasar por la pantalla admin. */
  async solicitarPrestamoLibro(libroId: number): Promise<any> {
    const usuarioId = await this.getUsuarioSistemaId();
    if (!usuarioId) {
      throw new Error('Usuario no encontrado');
    }
    const empresaId = this.getEmpresaId();
    const ejemplarData = await this.apiService.postRecord(
      `SELECT Id_Ejemplar FROM Bib_Ejemplar ` +
      `WHERE Libro_Id=${libroId} AND Id_Empresa=${empresaId} AND Estado='disponible' ` +
      `ORDER BY Id_Ejemplar ASC LIMIT 1`
    );
    const ejemplarId = Number(ejemplarData?.['data']?.[0]?.Id_Ejemplar || 0);
    if (!ejemplarId) {
      throw new Error('Ya no hay ejemplares disponibles. Intenta reservar el libro.');
    }
    const vencimiento = new Date();
    vencimiento.setDate(vencimiento.getDate() + 7);
    const fechaVencimiento = vencimiento.toISOString().slice(0, 10);
    return await this.createPrestamo(ejemplarId, usuarioId, fechaVencimiento);
  }

  async createPrestamo(ejemplarId: number, usuarioId: number, fechaVencimiento: string, observaciones?: string): Promise<any> {
    const validacion = await this.validarSolicitudCirculacion(usuarioId);
    if (!validacion.ok) {
      throw new Error(validacion.motivo || 'El usuario no cumple con las politicas de circulacion');
    }

    const sql = {
      table: 'Bib_Prestamo',
      fields: 'Ejemplar_Id,Usuario_Id,Fecha_Vencimiento,Estado,Observaciones',
      values: `${ejemplarId},${usuarioId},'${fechaVencimiento}','activo','${this.escapeSql(observaciones)}'`
    };
    const data = await this.apiService.insertRecord(sql);
    await this.apiService.updateRecord({
      table: 'Bib_Ejemplar',
      fields: "Estado='prestado'",
      where: 'Id_Ejemplar=' + ejemplarId
    });
    return data;
  }

  async renovarPrestamo(prestamoId: number, nuevaFecha: string, libroId?: number): Promise<{ renovado: boolean; enEspera: number; data?: any }> {
    const idLibro = libroId || await this.getLibroIdPrestamo(prestamoId);
    const enEspera = idLibro ? await this.contarReservasBloqueantesLibro(idLibro) : 0;
    if (enEspera > 0) {
      return { renovado: false, enEspera };
    }

    const data = await this.apiService.updateRecord({
      table: 'Bib_Prestamo',
      fields: `Fecha_Vencimiento='${nuevaFecha}',Renovaciones=Renovaciones+1,Estado='activo'`,
      where: 'Id_Prestamo=' + prestamoId
    });
    return { renovado: true, enEspera: 0, data };
  }

  async devolverPrestamo(prestamoId: number, ejemplarId: number): Promise<any> {
    const data = await this.apiService.updateRecord({
      table: 'Bib_Prestamo',
      fields: "Estado='devuelto',Fecha_Devolucion=NOW()",
      where: 'Id_Prestamo=' + prestamoId
    });
    await this.apiService.updateRecord({
      table: 'Bib_Ejemplar',
      fields: "Estado='disponible'",
      where: 'Id_Ejemplar=' + ejemplarId
    });
    return data;
  }

  async notificarSiguienteEnLista(libroId: number): Promise<{ notificado: boolean; reservaId?: number; usuario?: string }> {
    const empresaId = this.getEmpresaId();
    const data = await this.apiService.postRecord(
      `SELECT R.Id_Reserva, R.Posicion, U.Nombre AS Usuario ` +
      `FROM Bib_Reserva R ` +
      `INNER JOIN Seg_Usuario U ON U.Id_Usuario=R.Usuario_Id ` +
      `WHERE R.Libro_Id=${libroId} AND R.Id_Empresa=${empresaId} ` +
      `AND LOWER(R.Estado) IN ('activa','en espera') ` +
      `ORDER BY R.Posicion ASC, R.Fecha_Reserva ASC, R.Id_Reserva ASC LIMIT 1`
    );
    const row = this.getFirstDataRow(data);
    if (!row) {
      return { notificado: false };
    }

    const reservaId = Number(row.Id_Reserva);
    const posicion = Number(row.Posicion || 1);
    await this.apiService.updateRecord({
      table: 'Bib_Reserva',
      fields: "Estado='Disponible',Fecha_Asignacion=NOW(),Posicion=1",
      where: `Id_Reserva=${reservaId} AND Id_Empresa=${empresaId}`
    });
    await this.apiService.postRecord(
      `UPDATE Bib_Reserva ` +
      `SET Posicion=GREATEST(Posicion-1,1) ` +
      `WHERE Libro_Id=${libroId} AND Id_Empresa=${empresaId} ` +
      `AND LOWER(Estado) IN ('activa','en espera') AND Posicion>${posicion}`
    );

    return {
      notificado: true,
      reservaId,
      usuario: row.Usuario || ''
    };
  }

  async devolverPrestamoConNotificacion(
    prestamoId: number,
    ejemplarId: number,
    libroId: number
  ): Promise<{ data: any; notificado: boolean; reservaId?: number; usuario?: string }> {
    const data = await this.devolverPrestamo(prestamoId, ejemplarId);
    const notificacion = await this.notificarSiguienteEnLista(libroId);
    if (notificacion.notificado) {
      await this.apiService.updateRecord({
        table: 'Bib_Ejemplar',
        fields: "Estado='reservado'",
        where: `Id_Ejemplar=${ejemplarId} AND Id_Empresa=${this.getEmpresaId()}`
      });
    }
    return { data, ...notificacion };
  }

  async cancelReserva(reservaId: number): Promise<any> {
    return await this.apiService.updateRecord({
      table: 'Bib_Reserva',
      fields: "Estado='cancelada'",
      where: 'Id_Reserva=' + reservaId
    });
  }

  async atenderReserva(reservaId: number): Promise<any> {
    return await this.apiService.updateRecord({
      table: 'Bib_Reserva',
      fields: "Estado='atendida',Fecha_Asignacion=NOW()",
      where: 'Id_Reserva=' + reservaId
    });
  }

  async getPrestamosUsuario(): Promise<Prestamo[]> {
    const usuarioId = await this.getUsuarioSistemaId();
    if (!usuarioId) return [];

    const sqlConfig = {
      table: 'Bib_Prestamo P INNER JOIN Bib_Ejemplar E ON P.Ejemplar_Id = E.Id_Ejemplar',
      fields: 'P.Id_Prestamo, P.Ejemplar_Id, E.Libro_Id, P.Fecha_Prestamo, P.Fecha_Vencimiento, P.Fecha_Devolucion, P.Renovaciones, P.Estado, P.Observaciones',
      where: 'P.Usuario_Id = ' + usuarioId,
      orderField: 'P.Fecha_Prestamo',
      orderDirection: ' DESC ',
      Empresa: true
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return data['data'].map((row: any) => ({
        id: Number(row.Id_Prestamo),
        ejemplarId: Number(row.Ejemplar_Id),
        libroId: Number(row.Libro_Id),
        usuario: '',
        fechaPrestamo: row.Fecha_Prestamo,
        fechaVencimiento: row.Fecha_Vencimiento,
        fechaDevolucion: row.Fecha_Devolucion,
        renovaciones: Number(row.Renovaciones),
        estado: this.estadoPrestamoEfectivo(row.Estado, row.Fecha_Vencimiento, row.Fecha_Devolucion),
        observaciones: row.Observaciones || ''
      }));
    }
    return [];
  }

  async getMarcDicSubcamposPorTag(formatoId: number, tag: string): Promise<MarcDicSubcampo[]> {
    try {
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Subcampo S LEFT JOIN Bib_Marc_Dic_Formato F ON S.Id_Formato = F.Id_Formato',
        fields: 'S.Id_Dic_Subcampo, S.Id_Formato, F.Nombre AS Formato, S.Tag, S.Codigo, S.Nombre, S.Repetibilidad, S.Es_Obsoleto',
        where: `S.Id_Formato=${formatoId} AND S.Tag='${this.escapeSql(tag)}'`,
        orderField: 'S.Codigo',
        orderDirection: ' ASC ',
        Empresa: false
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Subcampo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          codigo: row.Codigo,
          nombre: row.Nombre,
          repetibilidad: row.Repetibilidad || undefined,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getReservasUsuario(): Promise<Reserva[]> {
    const usuarioId = await this.getUsuarioSistemaId();
    if (!usuarioId) return [];

    const sqlConfig = {
      table: 'Bib_Reserva',
      fields: 'Id_Reserva, Libro_Id, Posicion, Estado, Fecha_Reserva, Fecha_Asignacion',
      where: 'Usuario_Id = ' + usuarioId,
      orderField: 'Fecha_Reserva',
      orderDirection: ' DESC ',
      Empresa: true
    };
    const data = await this.apiService.executeSqlSyn(sqlConfig);
    if (data && data['total'] > 0) {
      return data['data'].map((row: any) => ({
        id: Number(row.Id_Reserva),
        libroId: Number(row.Libro_Id),
        usuario: '',
        posicion: Number(row.Posicion),
        estado: row.Estado,
        fechaReserva: row.Fecha_Reserva,
        fechaAsignacion: row.Fecha_Asignacion
      }));
    }
    return [];
  }

  async getMarcDicSubcamposPorTags(formatoId: number, tags: string[]): Promise<MarcDicSubcampo[]> {
    if (!formatoId || !tags?.length) {
      return [];
    }
    try {
      const tagsList = tags.map(tag => `'${this.escapeSql(tag)}'`).join(',');
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Subcampo S LEFT JOIN Bib_Marc_Dic_Formato F ON S.Id_Formato = F.Id_Formato',
        fields: 'S.Id_Dic_Subcampo, S.Id_Formato, F.Nombre AS Formato, S.Tag, S.Codigo, S.Nombre, S.Repetibilidad, S.Es_Obsoleto',
        where: `S.Id_Formato=${formatoId} AND S.Tag IN (${tagsList})`,
        orderField: 'S.Tag, S.Codigo',
        orderDirection: ' ASC ',
        Empresa: false,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Subcampo),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          codigo: row.Codigo,
          nombre: row.Nombre,
          repetibilidad: row.Repetibilidad || undefined,
          esObsoleto: Number(row.Es_Obsoleto || 0) === 1
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getMarcDicIndicadoresPorTags(formatoId: number, tags: string[]): Promise<MarcDicIndicador[]> {
    if (!formatoId || !tags?.length) {
      return [];
    }
    try {
      const tagsList = tags.map(tag => `'${this.escapeSql(tag)}'`).join(',');
      const sqlConfig = {
        table: 'Bib_Marc_Dic_Indicador I LEFT JOIN Bib_Marc_Dic_Formato F ON I.Id_Formato = F.Id_Formato',
        fields: 'I.Id_Dic_Indicador, I.Id_Formato, F.Nombre AS Formato, I.Tag, I.Posicion, I.Valor, I.Significado',
        where: `I.Id_Formato=${formatoId} AND I.Tag IN (${tagsList})`,
        orderField: 'I.Tag, I.Posicion, I.Valor',
        orderDirection: ' ASC ',
        Empresa: false,
        simple: true
      };
      const data = await this.apiService.executeSqlSyn(sqlConfig);
      if (data && data['total'] > 0) {
        return data['data'].map((row: any) => ({
          id: Number(row.Id_Dic_Indicador),
          formatoId: Number(row.Id_Formato),
          formatoNombre: row.Formato || '',
          tag: row.Tag,
          posicion: Number(row.Posicion),
          valor: row.Valor,
          significado: row.Significado
        }));
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
