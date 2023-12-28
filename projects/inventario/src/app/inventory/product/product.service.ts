import { Injectable, Component } from '@angular/core';
import { ApiService } from '../../../../../core/src/app/lib/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private apiService: ApiService) {}

  async loadProducts(paginacion,search?,Tipo_Codigo?){
    let where = '';
    if(Tipo_Codigo){
      where = 'Tipo_Codigo='+Tipo_Codigo;
    }
    let sqlConfig = {
      table: 'Inv_Producto left Join Inv_Categoria On Inv_Producto.Categoria = Inv_Categoria.Id_Categoria left join Inv_Sub_Categoria on Inv_Producto.Id_Sub_Categoria = Inv_Sub_Categoria.Id_Sub_Categoria',
      fields: 'Id_Producto,Codigo,SKU,Descripcion,Precio,Impuesto,Inv_Producto.Estado,Inv_Categoria.Nombre as Categoria,Inv_Sub_Categoria.Nombre as SubCategoria,Ultimo_Costo, Existencia',
      orderField: '',
      searchField: search,
      paginacion: paginacion,
      where:where
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadProductsBySubCategory(Id_Sub_Categoria?,search?,Estado?){
    let where = "Inv_Producto.Id_Sub_Categoria="+Id_Sub_Categoria
    if(Estado){
      where = "Inv_Producto.Estado = 1 and " + where
    }
    let sqlConfig = {
      table: 'Inv_Producto left Join Inv_Categoria On Inv_Producto.Categoria = Inv_Categoria.Id_Categoria inner join Inv_Sub_Categoria on Inv_Producto.Id_Sub_Categoria = Inv_Sub_Categoria.Id_Sub_Categoria',
      fields: 'Id_Producto,Codigo,SKU,Descripcion,Precio,Impuesto,Inv_Producto.Estado,Inv_Categoria.Nombre as Categoria,Inv_Sub_Categoria.Nombre as SubCategoria,Inv_Categoria.Cocina,Ultimo_Costo,Foto',
      orderField: 'Orden,Descripcion',
      searchField: search,
      orderDirection: " ASC ",
      where:where 
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadProductsByCategory(Id_Categoria,search?,Estado?){
    let where ='Inv_Producto.Categoria = \'' + Id_Categoria + '\''
    if(Estado){
      where = "Inv_Producto.Estado = 1 and " + where
    }
    let sqlConfig = {
      table: 'Inv_Producto left Join Inv_Categoria On Inv_Producto.Categoria = Inv_Categoria.Id_Categoria',
      fields: 'Id_Producto,Codigo,SKU,Descripcion,Precio,Impuesto,Inv_Producto.Estado,Inv_Categoria.Nombre as Categoria,Inv_Categoria.Cocina,Ultimo_Costo,Foto',
      orderField: '',
      searchField: search,
      where: where 
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadComponentes(Id_Producto){
    let sqlConfig = {
      table: 'Inv_Producto_Componente left Join Inv_Producto on Inv_Producto_Componente.Id_Producto_Relacionado = Inv_Producto.Id_Producto',
      fields: 'Id_Producto_Componente,Nombre,Inv_Producto_Componente.Precio,Grupo,Adicional,Opcional,Inv_Producto_Componente.Id_Producto_Relacionado,Inv_Producto_Componente.Cantidad_Relacionada, Inv_Producto.Descripcion as Producto_Relacionado_Nombre',
      orderField: '',
      where:'Inv_Producto_Componente.Id_Producto='+Id_Producto
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadSubComponetes(Id_Componente){
    let sqlConfig = {
      table: 'Inv_Producto_Sub_Componente',
      fields: 'Id_Producto_Sub_Componente,Nombre',
      orderField: '',
      where:'Id_Producto_Componente='+Id_Componente
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async newComponent(Componente){
    let sql = {
      table: 'Inv_Producto_Componente',
      fields: 'Id_Producto,Nombre,Precio,Grupo,Adicional,Opcional,Id_Producto_Relacionado,Cantidad_Relacionada',
      values: '\'' + Componente.Id_Producto
      + '\',\'' + Componente.Nombre
      + '\',\'' + Componente.Precio
      + '\',\'' + Componente.Grupo
      + '\',\'' + Componente.Adicional
      + '\',\'' + Componente.Opcional
      + '\',\'' + Componente.Id_Producto_Relacionado
      + '\',\'' + Componente.Cantidad_Realcionada
      + '\',\'' + Componente.Opcional
      + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async newSubComponent(Componente){
    let sql = {
      table: 'Inv_Producto_Sub_Componente',
      fields: 'Id_Producto_Componente,Nombre',
      values: '\'' + Componente.Id_Producto_Componente
      + '\',\'' + Componente.Nombre + '\''
    };
    return await this.apiService.insertRecord(sql);
  }
  async deleteSubCompoente(Id_Producto_Sub_Componente){
    let sql = "DELETE FROM Inv_Producto_Sub_Componente WHERE Id_Producto_Sub_Componente = " + Id_Producto_Sub_Componente;
    return await this.apiService.postRecord(sql);
  }

  async updateSubComponete(Componente){
    let sql = {
      table: 'Inv_Producto_Sub_Componente',
      fields: 'Nombre=\'' + Componente.Nombre +  '\'',
      where: 'Id_Producto_Sub_Componente=' + Componente.Id_Producto_Sub_Componente
    };
    return await this.apiService.updateRecord(sql);
  }

  async updateComponete(Componente){
    let sql = {
      table: 'Inv_Producto_Componente',
      fields: 'Nombre=\'' + Componente.Nombre
      + '\',Precio=\'' + Componente.Precio
      + '\',Adicional=\'' + Componente.Adicional
      + '\',Grupo=\'' + Componente.Grupo
      + '\',Id_Producto_Relacionado=\'' + Componente.Id_Producto_Relacionado
      + '\',Cantidad_Relacionada=\'' + Componente.Cantidad_Relacionada
      + '\',Opcional=\'' + Componente.Opcional  + '\'',
      where: 'Id_Producto_Componente=' + Componente.Id_Producto_Componente
    };
    return await this.apiService.updateRecord(sql);
  }
  async saveArticle(Article){
    if (Article.Minimo ==''){
      Article.Minimo = 0;
    }
    if (Article.Maximo ==''){
      Article.Maximo = 0;
    }
    if(Article.Id_Producto ==""){
      let sql = {
        table: 'Inv_Producto',
        fields: 'Descripcion,Tipo_Codigo,Codigo,SKU,Unidad_Medida,Tipo_Impuesto,Impuesto,Precio,Categoria,Id_Categoria,Id_Sub_Categoria,Moneda,Minimo,Maximo,Codigo_Proveedor,Orden,Id_Producto_Relacionado,Cantidad_Relacionada,Estado,Existencia,Foto',
        values: '\'' + Article.Descripcion
        + '\',\'' + Article.Tipo_Codigo
        + '\',\'' + Article.Codigo
        + '\',\'' + Article.SKU
        + '\',\'' + Article.Unidad_Medida
        + '\',\'' + Article.Tipo_Impuesto
        + '\',\'' + Article.Impuesto
        + '\',\'' + Article.Precio
        + '\',\'' + Article.Categoria
        + '\',\'' + Article.Categoria
        + '\',\'' + Article.Id_Sub_Categoria
        + '\',\'' + Article.Moneda
        + '\',\'' + Article.Minimo
        + '\',\'' + Article.Maximo
        + '\',\'' + Article.Codigo_Proveedor
        + '\',\'' + Article.Orden
        + '\',\'' + Article.Id_Producto_Relacionado
        + '\',\'' + Article.Cantidad_Relacionada
        + '\',\'' + Article.Estado
        + '\',\'' + Article.Existencia
        + '\',\'' + Article.Foto
        + '\''
      };
      return await this.apiService.insertRecord(sql);
    }else{
      let sql = {
        table: 'Inv_Producto',
        fields: 'Descripcion=\'' + Article.Descripcion
        + '\',Tipo_Codigo=\'' + Article.Tipo_Codigo
        + '\',Codigo=\'' + Article.Codigo
        + '\',SKU=\'' + Article.SKU
        + '\',Unidad_Medida=\'' + Article.Unidad_Medida
        + '\',Tipo_Impuesto=\'' + Article.Tipo_Impuesto
        + '\',Impuesto=\'' + Article.Impuesto
        + '\',Precio=\'' + Article.Precio
        + '\',Categoria=\'' + Article.Categoria
        + '\',Id_Sub_Categoria=\'' + Article.Id_Sub_Categoria
        + '\',Moneda=\'' + Article.Moneda
        + '\',Minimo=\'' + Article.Minimo
        + '\',Maximo=\'' + Article.Maximo
        + '\',Codigo_Proveedor=\'' + Article.Codigo_Proveedor
        + '\',Orden=\'' + Article.Orden
        + '\',Id_Producto_Relacionado=\'' + Article.Id_Producto_Relacionado
        + '\',Cantidad_Relacionada=\'' + Article.Cantidad_Relacionada
        + '\',Estado=\''+ Article.Estado
        + '\',Existencia=\''+ Article.Existencia
        + '\',Foto=\''+ Article.Foto
        + '\'',
        where: 'Id_Producto=' + Article.Id_Producto
      };
      return await this.apiService.updateRecord(sql);
    }
  }
  async loadArticle(Id_Producto){
    let sqlConfig = {
      table: 'Inv_Producto left Join Inv_Producto as Relacionado on Inv_Producto.Id_Producto_Relacionado = Relacionado.Id_Producto',
      fields: 'Inv_Producto.Id_Producto,Inv_Producto.Descripcion,Inv_Producto.Tipo_Codigo,Inv_Producto.Codigo,Inv_Producto.SKU,Inv_Producto.Unidad_Medida,Inv_Producto.Tipo_Impuesto,Inv_Producto.Impuesto,Inv_Producto.Precio,Inv_Producto.Categoria,Inv_Producto.Id_Sub_Categoria,Inv_Producto.Moneda,Inv_Producto.Estado,Inv_Producto.Minimo,Inv_Producto.Maximo,Inv_Producto.Existencia,Inv_Producto.Ultimo_Costo,Inv_Producto.Costo_Promedio,Inv_Producto.Codigo_Proveedor,Inv_Producto.Orden,Inv_Producto.Id_Producto_Relacionado,Inv_Producto.Cantidad_Relacionada,Relacionado.Descripcion as Producto_Relacionado_Nombre,Inv_Producto.Foto',
      orderField: '',
      searchField: '',
      where: 'Inv_Producto.Id_Producto = ' + Id_Producto
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadSKU(Nombre){
    let sqlConfig = {
      table: 'Inv_Producto',
      fields: 'Id_Producto,Descripcion,SKU',
      orderField: '',
      searchField: '',
      where: 'Descripcion = \'' + Nombre + '\''
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadIdFromSKU(SKU){
    let sqlConfig = {
      table: 'Inv_Producto',
      fields: 'Id_Producto',
      orderField: '',
      searchField: '',
      where: 'SKU = \'' + SKU + '\''
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }
  async loadCodigoProveedor(Nombre){
    let sqlConfig = {
      table: 'Inv_Producto',
      fields: 'Id_Producto,Descripcion,SKU',
      orderField: '',
      searchField: '',
      where: 'Codigo_Proveedor = \'' + Nombre + '\''
    }
    return await this.apiService.executeSqlSyn(sqlConfig);
  }

  async loadProductLike(producto,tipo?,tipo2?){
    let where =  '( Id_Producto like \'---' + producto + '---\' or Descripcion like \'---' + producto + '---\' or SKU like \'---' + producto + '---\' or Codigo like \'---' + producto + '---\') and Estado = 1'
    if(tipo){
      if(tipo2){
        where = where + ' and (Tipo_Codigo =' + tipo + ' or Tipo_Codigo =' + tipo2 + ')';
      }else{
        where = where + ' and Tipo_Codigo =' + tipo;
      }
    }

    let sqlProducto = {
      table: 'Inv_Producto',
      fields: 'Id_Producto,Codigo,SKU,Tipo_Codigo,Descripcion,Unidad_Medida,Categoria,Impuesto,Tipo_Impuesto,Precio,Moneda,Estado,Ultimo_Costo',
      where: where
     };
     return await this.apiService.executeSqlSyn(sqlProducto);
  }
  async loadProduct(producto,tipo?,tipo2?){
    let where = '( SKU = \'' + producto + '\' )';
    if(tipo){
      if(tipo2){
        where = where + ' and (Tipo_Codigo =' + tipo + ' or Tipo_Codigo =' + tipo2 + ')';
      }else{
        where = where + ' and Tipo_Codigo =' + tipo;
      }
    }
    let sqlProducto = {
      table: 'Inv_Producto',
      fields: 'Id_Producto,Codigo,SKU,Tipo_Codigo,Descripcion,Unidad_Medida,Categoria,Impuesto,Tipo_Impuesto,Precio,Moneda,Estado,Ultimo_Costo',
      where: where
     };
     return await this.apiService.executeSqlSyn(sqlProducto);
  }
  async LeerSubCategorias(Id_Categoria){
    let sqlProducto = {
      table: 'Inv_Sub_Categoria',
      fields: 'Id_Sub_Categoria,Nombre',
      where: 'Id_Categoria = ' + Id_Categoria
     };
     return await this.apiService.executeSqlSyn(sqlProducto);
  }

  async loadFile(file){
    return await this.apiService.loadImg(file);
  }
}
