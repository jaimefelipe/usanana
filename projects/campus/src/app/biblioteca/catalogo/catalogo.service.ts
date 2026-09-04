import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({ providedIn: 'root' })
export class CatalogoService {

  constructor(private apiService: ApiService) {}

  async buscarLibros(termino: string = '', categoriaId: number = 0) {
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    if (!idEmpresa) return { success: 'false', total: 0, data: [] };

    let filtros = `L.Id_Empresa = ${idEmpresa}`;
    if (termino) {
      const t = termino.replace(/'/g, "''");
      filtros += ` AND (L.Titulo LIKE '%${t}%' OR L.Subtitulo LIKE '%${t}%' OR L.ISBN LIKE '%${t}%')`;
    }
    if (categoriaId > 0) {
      filtros += ` AND L.Categoria_Id = ${categoriaId}`;
    }

    const sql = `
      SELECT
        L.Id_Libro,
        L.Titulo,
        L.Subtitulo,
        L.ISBN,
        L.Anio_Publicacion,
        L.Descripcion,
        COALESCE(L.Licencia, '') AS Licencia,
        (SELECT EJI.Imagen_Portada FROM Bib_Ejemplar EJI
         WHERE EJI.Libro_Id = L.Id_Libro AND EJI.Id_Empresa = ${idEmpresa}
           AND LENGTH(EJI.Imagen_Portada) > 0
         ORDER BY EJI.Id_Ejemplar ASC LIMIT 1) AS Imagen_Portada,
        COALESCE(E.Nombre, '') AS Editorial,
        COALESCE(C.Nombre, '') AS Categoria,
        COALESCE(C.Id_Categoria, 0) AS Id_Categoria,
        COALESCE(TM.Nombre, '') AS Tipo_Material,
        (SELECT COUNT(*) FROM Bib_Ejemplar EJ
         WHERE EJ.Libro_Id = L.Id_Libro
           AND EJ.Estado = 'disponible'
           AND EJ.Id_Empresa = ${idEmpresa}) AS Disponibles,
        (SELECT COUNT(*) FROM Bib_Ejemplar EJ
         WHERE EJ.Libro_Id = L.Id_Libro
           AND EJ.Id_Empresa = ${idEmpresa}) AS TotalEjemplares,
        (SELECT GROUP_CONCAT(A.Nombre ORDER BY A.Nombre SEPARATOR ', ')
         FROM Bib_Libro_Autor LA
         JOIN Bib_Autor A ON LA.Autor_Id = A.Id_Autor
         WHERE LA.Libro_Id = L.Id_Libro) AS Autores
      FROM Bib_Libro L
      LEFT JOIN Bib_Editorial E ON L.Editorial_Id = E.Id_Editorial AND E.Id_Empresa = ${idEmpresa}
      LEFT JOIN Bib_Categoria C ON L.Categoria_Id = C.Id_Categoria AND C.Id_Empresa = ${idEmpresa}
      LEFT JOIN Bib_Tipo_Material TM ON L.Id_Tipo_Material = TM.Id_Tipo_Material
      WHERE ${filtros}
      ORDER BY L.Titulo ASC
      LIMIT 50
    `;
    return await this.apiService.postRecord(sql);
  }

  async listarCategorias() {
    const idEmpresa = Number(localStorage.getItem('Id_Empresa'));
    if (!idEmpresa) return { success: 'false', total: 0, data: [] };
    const sql = `
      SELECT Id_Categoria, Nombre
      FROM Bib_Categoria
      WHERE Id_Empresa = ${idEmpresa}
      ORDER BY Nombre ASC
    `;
    return await this.apiService.postRecord(sql);
  }
}
