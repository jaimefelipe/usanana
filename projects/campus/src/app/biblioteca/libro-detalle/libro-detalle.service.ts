import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({ providedIn: 'root' })
export class LibroDetalleService {

  constructor(private apiService: ApiService) {}

  private getIdEmpresa(): number {
    return Number(localStorage.getItem('Id_Empresa'));
  }

  private estadosReservaBloqueantesSql(alias = ''): string {
    const prefix = alias ? `${alias}.` : '';
    return `LOWER(${prefix}Estado) IN ('activa','en espera','disponible')`;
  }

  async obtenerLibro(idLibro: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idLibro) return { success: 'false', total: 0, data: [] };
    const sql = `
      SELECT
        L.Id_Libro, L.Titulo, L.Subtitulo, L.ISBN, L.ISSN, L.DOI,
        L.Idioma, L.Anio_Publicacion, L.Edicion, L.Descripcion, L.Palabras_Clave,
        COALESCE(L.Licencia, '') AS Licencia,
        (SELECT EJI.Imagen_Portada FROM Bib_Ejemplar EJI
         WHERE EJI.Libro_Id = L.Id_Libro AND EJI.Id_Empresa = ${idEmpresa}
           AND LENGTH(EJI.Imagen_Portada) > 0
         ORDER BY EJI.Id_Ejemplar ASC LIMIT 1) AS Imagen_Portada,
        COALESCE(E.Nombre, '') AS Editorial,
        COALESCE(C.Nombre, '') AS Categoria,
        COALESCE(TM.Nombre, '') AS Tipo_Material
      FROM Bib_Libro L
      LEFT JOIN Bib_Editorial E ON L.Editorial_Id = E.Id_Editorial AND E.Id_Empresa = L.Id_Empresa
      LEFT JOIN Bib_Categoria C ON L.Categoria_Id = C.Id_Categoria AND C.Id_Empresa = L.Id_Empresa
      LEFT JOIN Bib_Tipo_Material TM ON L.Id_Tipo_Material = TM.Id_Tipo_Material AND TM.Id_Empresa = L.Id_Empresa
      WHERE L.Id_Libro = ${idLibro} AND L.Id_Empresa = ${idEmpresa}
    `;
    return await this.apiService.postRecord(sql);
  }

  async obtenerAutores(idLibro: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idLibro) return { success: 'false', total: 0, data: [] };
    const sql = `
      SELECT A.Nombre, COALESCE(LA.Rol, '') AS Rol
      FROM Bib_Libro_Autor LA
      INNER JOIN Bib_Autor A ON A.Id_Autor = LA.Autor_Id AND A.Id_Empresa = LA.Id_Empresa
      WHERE LA.Libro_Id = ${idLibro} AND LA.Id_Empresa = ${idEmpresa}
      ORDER BY A.Nombre ASC
    `;
    return await this.apiService.postRecord(sql);
  }

  async obtenerEjemplares(idLibro: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idLibro) return { success: 'false', total: 0, data: [] };
    const sql = `
      SELECT
        Id_Ejemplar,
        COALESCE(Codigo_Barra, '') AS Codigo_Barra,
        Estado,
        Tipo_Soporte,
        COALESCE(URL_Archivo, '') AS URL_Archivo,
        COALESCE(Sede, '') AS Sede
      FROM Bib_Ejemplar
      WHERE Libro_Id = ${idLibro} AND Id_Empresa = ${idEmpresa}
      ORDER BY Estado ASC, Id_Ejemplar ASC
    `;
    return await this.apiService.postRecord(sql);
  }

  async verificarReservaExistente(idLibro: number, idUsuario: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idLibro || !idUsuario) return { success: 'false', total: 0, data: [] };
    const sql = `
      SELECT Id_Reserva
      FROM Bib_Reserva
      WHERE Libro_Id = ${idLibro}
        AND Usuario_Id = ${idUsuario}
        AND Id_Empresa = ${idEmpresa}
        AND ${this.estadosReservaBloqueantesSql()}
      LIMIT 1
    `;
    return await this.apiService.postRecord(sql);
  }

  /**
   * Politica de circulacion (Bib_Politica_Prestamo). Si no hay politica configurada
   * se usa el default institucional: 7 dias de prestamo, maximo 2 prestamos+reservas
   * activos por usuario (mismos valores que usa la app de Biblioteca).
   */
  private async obtenerPolitica(): Promise<{ diasPrestamo: number; maxActivos: number }> {
    const idEmpresa = this.getIdEmpresa();
    const data = await this.apiService.postRecord(`
      SELECT Dias_Prestamo, Max_Prestamos
      FROM Bib_Politica_Prestamo
      WHERE Id_Empresa = ${idEmpresa}
      ORDER BY Id_Politica_Prestamo ASC
      LIMIT 1
    `);
    const row = data?.['data']?.[0];
    return {
      diasPrestamo: Number(row?.Dias_Prestamo || 7),
      maxActivos: Number(row?.Max_Prestamos || 2)
    };
  }

  /** Cantidad de prestamos + reservas activos del usuario (para el limite combinado). */
  private async contarCirculacionActiva(idUsuario: number): Promise<number> {
    const idEmpresa = this.getIdEmpresa();
    const data = await this.apiService.postRecord(`
      SELECT
        (SELECT COUNT(*) FROM Bib_Prestamo
         WHERE Usuario_Id = ${idUsuario} AND Id_Empresa = ${idEmpresa}
           AND LOWER(Estado) IN ('activo','pendiente')) +
        (SELECT COUNT(*) FROM Bib_Reserva
         WHERE Usuario_Id = ${idUsuario} AND Id_Empresa = ${idEmpresa}
           AND ${this.estadosReservaBloqueantesSql()}) AS Total
    `);
    return Number(data?.['data']?.[0]?.Total || 0);
  }

  /** Valida limite combinado de prestamos/reservas antes de solicitar cualquiera de los dos. */
  async validarLimiteCirculacion(idUsuario: number): Promise<{ ok: boolean; motivo?: string }> {
    const { maxActivos } = await this.obtenerPolitica();
    const total = await this.contarCirculacionActiva(idUsuario);
    if (total >= maxActivos) {
      return {
        ok: false,
        motivo: `Ya tienes ${total} prestamo(s)/reserva(s) activos. El maximo permitido es ${maxActivos}.`
      };
    }
    return { ok: true };
  }

  private async elegirEjemplarDisponible(idLibro: number): Promise<number | null> {
    const idEmpresa = this.getIdEmpresa();
    const data = await this.apiService.postRecord(`
      SELECT Id_Ejemplar
      FROM Bib_Ejemplar
      WHERE Libro_Id = ${idLibro} AND Id_Empresa = ${idEmpresa} AND Estado = 'disponible'
      ORDER BY Id_Ejemplar ASC
      LIMIT 1
    `);
    const id = data?.['data']?.[0]?.Id_Ejemplar;
    return id ? Number(id) : null;
  }

  /** Prestamo directo, solo cuando hay al menos un ejemplar disponible. */
  async crearPrestamo(idLibro: number, idUsuario: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idLibro || !idUsuario) {
      return { success: 'false', Error: 'Datos insuficientes para crear el prestamo.' };
    }

    const ejemplarId = await this.elegirEjemplarDisponible(idLibro);
    if (!ejemplarId) {
      return { success: 'false', Error: 'Ya no hay ejemplares disponibles. Intenta reservar el libro.' };
    }

    const { diasPrestamo } = await this.obtenerPolitica();
    const vencimiento = new Date();
    vencimiento.setDate(vencimiento.getDate() + diasPrestamo);
    const fechaVencimiento = vencimiento.toISOString().slice(0, 19).replace('T', ' ');

    const insert = await this.apiService.insertRecord({
      table: 'Bib_Prestamo',
      fields: 'Ejemplar_Id,Usuario_Id,Fecha_Vencimiento,Estado',
      values: `${ejemplarId},${idUsuario},'${fechaVencimiento}','activo'`
    });
    if (!insert || insert['success'] !== 'true') {
      return insert;
    }

    await this.apiService.updateRecord({
      table: 'Bib_Ejemplar',
      fields: "Estado='prestado'",
      where: 'Id_Ejemplar=' + ejemplarId
    });
    return insert;
  }

  async crearReserva(idLibro: number, idUsuario: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idLibro || !idUsuario) {
      return { success: 'false', Error: 'Datos insuficientes para crear la reserva.' };
    }

    const posResult = await this.apiService.postRecord(`
      SELECT COALESCE(MAX(Posicion), 0) + 1 AS Posicion
      FROM Bib_Reserva
      WHERE Libro_Id = ${idLibro}
        AND Id_Empresa = ${idEmpresa}
        AND ${this.estadosReservaBloqueantesSql()}
    `);
    const posicion = Number(posResult?.['data']?.[0]?.Posicion || 1);

    return await this.apiService.insertRecord({
      table: 'Bib_Reserva',
      fields: 'Libro_Id,Usuario_Id,Posicion,Estado,Fecha_Reserva',
      values: `'${idLibro}','${idUsuario}','${posicion}','En espera',NOW()`
    });
  }
}
