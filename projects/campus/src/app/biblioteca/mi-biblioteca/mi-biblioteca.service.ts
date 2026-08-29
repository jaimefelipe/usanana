import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({ providedIn: 'root' })
export class MiBibliotecaService {

  constructor(private apiService: ApiService) {}

  private getIdEmpresa(): number {
    return Number(localStorage.getItem('Id_Empresa'));
  }

  private getIdUsuario(): number {
    return Number(localStorage.getItem('Id_Usuario'));
  }

  private estadoReservaBloqueanteSql(alias = ''): string {
    const prefix = alias ? `${alias}.` : '';
    return `LOWER(${prefix}Estado) IN ('activa','en espera','disponible')`;
  }

  async obtenerUsuarioBiblioteca() {
    const idEmpresa = this.getIdEmpresa();
    const idUsuario = this.getIdUsuario();
    if (!idEmpresa || !idUsuario) return { success: 'false', total: 0, data: [] };

    const sql = `
      SELECT
        U.Id_Usuario,
        U.Nombre,
        COALESCE(U.Correo, '') AS Correo,
        COALESCE(U.Telefono, '') AS Telefono,
        COALESCE(U.Numero_Identificacion, '') AS Numero_Identificacion,
        COALESCE(U.Tipo_Usuario, '') AS Tipo_Usuario,
        CASE WHEN COALESCE(U.Estado, 0) = 1 AND COALESCE(UE.Estado, 0) = 1 THEN 0 ELSE 1 END AS Bloqueado,
        COALESCE((
          SELECT SUM(M.Saldo)
          FROM Bib_Multa M
          WHERE M.Id_Empresa = ${idEmpresa}
            AND M.Usuario_Id = U.Id_Usuario
            AND LOWER(M.Estado) IN ('pendiente','activo')
        ), 0) AS Multa_Acumulada
      FROM Seg_Usuario_Empresa UE
      INNER JOIN Seg_Usuario U ON U.Id_Usuario = UE.Id_Usuario
      WHERE UE.Id_Empresa = ${idEmpresa}
        AND UE.Id_Usuario = ${idUsuario}
      LIMIT 1
    `;
    return await this.apiService.postRecord(sql);
  }

  async obtenerPrestamos(idUsuario: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idUsuario) return { success: 'false', total: 0, data: [] };

    const sql = `
      SELECT
        P.Id_Prestamo,
        L.Titulo,
        COALESCE(EJ.Codigo_Barra, '') AS Codigo_Barra,
        P.Fecha_Prestamo,
        P.Fecha_Vencimiento,
        CASE
          WHEN P.Fecha_Devolucion IS NULL AND P.Fecha_Vencimiento < NOW() THEN 'vencido'
          ELSE LOWER(P.Estado)
        END AS Estado,
        P.Renovaciones,
        CASE
          WHEN P.Fecha_Devolucion IS NULL AND P.Fecha_Vencimiento < NOW() THEN DATEDIFF(NOW(), P.Fecha_Vencimiento)
          ELSE 0
        END AS Dias_Vencido
      FROM Bib_Prestamo P
      INNER JOIN Bib_Ejemplar EJ ON EJ.Id_Ejemplar = P.Ejemplar_Id AND EJ.Id_Empresa = P.Id_Empresa
      INNER JOIN Bib_Libro L ON L.Id_Libro = EJ.Libro_Id AND L.Id_Empresa = P.Id_Empresa
      WHERE P.Usuario_Id = ${idUsuario}
        AND P.Id_Empresa = ${idEmpresa}
        AND P.Fecha_Devolucion IS NULL
        AND LOWER(P.Estado) IN ('activo','pendiente','vencido')
      ORDER BY P.Fecha_Vencimiento ASC, P.Id_Prestamo ASC
    `;
    return await this.apiService.postRecord(sql);
  }

  async obtenerReservas(idUsuario: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idUsuario) return { success: 'false', total: 0, data: [] };

    const sql = `
      SELECT
        R.Id_Reserva,
        L.Titulo,
        R.Fecha_Reserva,
        R.Fecha_Asignacion,
        R.Estado,
        R.Posicion
      FROM Bib_Reserva R
      INNER JOIN Bib_Libro L ON L.Id_Libro = R.Libro_Id AND L.Id_Empresa = R.Id_Empresa
      WHERE R.Usuario_Id = ${idUsuario}
        AND R.Id_Empresa = ${idEmpresa}
        AND ${this.estadoReservaBloqueanteSql('R')}
      ORDER BY R.Fecha_Reserva DESC, R.Id_Reserva DESC
    `;
    return await this.apiService.postRecord(sql);
  }

  async obtenerMultas(idUsuario: number) {
    const idEmpresa = this.getIdEmpresa();
    if (!idEmpresa || !idUsuario) return { success: 'false', total: 0, data: [] };

    const sql = `
      SELECT
        M.Id_Multa,
        COALESCE(L.Titulo, 'N/A') AS Titulo,
        M.Monto,
        M.Saldo,
        M.Motivo,
        M.Fecha_Generacion,
        M.Estado
      FROM Bib_Multa M
      LEFT JOIN Bib_Prestamo P ON P.Id_Prestamo = M.Prestamo_Id AND P.Id_Empresa = M.Id_Empresa
      LEFT JOIN Bib_Ejemplar EJ ON EJ.Id_Ejemplar = P.Ejemplar_Id AND EJ.Id_Empresa = M.Id_Empresa
      LEFT JOIN Bib_Libro L ON L.Id_Libro = EJ.Libro_Id AND L.Id_Empresa = M.Id_Empresa
      WHERE M.Usuario_Id = ${idUsuario}
        AND M.Id_Empresa = ${idEmpresa}
        AND LOWER(M.Estado) IN ('pendiente','activo')
      ORDER BY M.Fecha_Generacion DESC, M.Id_Multa DESC
    `;
    return await this.apiService.postRecord(sql);
  }
}
