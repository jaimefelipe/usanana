const { DecimalPipe } = require("@angular/common");

let factura = {
  encabezado : {
    CodigoActividad : String(6), // 6 Codigo de actividad Principal
    Clave: String(50),
    NumeroConsecutivo : String(20),  // Nota 1 y 3
    FechaEmision : String(20), // 2016-09-26T13:00:00+06:00
    Emisor : {
      Nombre: String(100),
      Identificacion : {
        Tipo : String(2), // Nota 4
        Numero: String(12)
      },
      NombreComercial: String(80),
      Ubicacion : {
        Provincia : String(1), // Nota 14 y 7
        Canton : String(2), // Nota 14 y 7
        Distrito : String(2), // Nota 14 y 7
        Barrio : String(2), // Nota 14 y 7
        OtrasSenas : String(250)
      },
      Telefono : {
        CodigoPais : Integer(3),
        NumTelefono : Integer(20)
      },
      Fax: {
        CodigoPais : Integer(3),
        NumTelefono : Integer(20),
      },
      CorreoElectronico : String(160)
    },
    Receptor : {
      Nombre : String(100),
      Identificacion: {
        Tipo : String(2),
        Numero : String(12),
      },
      IdentificacionExtranjero :String(20),
      NombreComercial : String(80),
      Ubicacion : {
        Provincia : String(1), // Nota 14 y 7
        Canton : String(2), // Nota 14 y 7
        Distrito : String(2), // Nota 14 y 7
        Barrio : String(2), // Nota 14 y 7
        OtrasSenas : String(250)
      },
      OtrasSenasExtranjero : String(300),
      Telefono : {
        CodigoPais : Integer(3),
        NumTelefono : Integer(20)
      },
      Fax: {
        CodigoPais : Integer(3),
        NumTelefono : Integer(20),
      },
      CorreoElectronico : String(160)
    },
    CondicionVenta : String(2), //Notas 5 y 7
    PlazoCredito : String(10),
    MedioPago : String (2), //Notas 6 y 7
  },
  DetalleServicio : { // Array
    NumeroLinea : Integer(1-100),
    PartidaArancelaria : String(12),  // obgligatorio en Exportación
    Codigo : String(13), // Nota 17
    CodigoComercial : {
      Tipo: String(2),
      Codigo: String(20),
    },
    Cantidad: DecimalPipe(16,3),
    UnidadMedida:  String(15), // Nota 15
    UnidadMedidaComercial : String(20),
    Detalle: String(200),
    PrecioUnitario: DecimalPipe(18,5),
    MontoTotal : Decimail (18,5),
    Descuento : {
      MontoDescuento : Decimal(18,5),
      NaturalezaDescuento : String(80),
    },
    SubTotal:Decimail(18,5),
    BaseImponible:Decimal(18,5), // Codigo Impuesto 07
    Impuesto : {
      Codigo: String(2),
      CodigoTarifa: String(2),
      Tarifa : Decimal(4,2),
      FactorIVA: Decimal(5,4),
      Monto: Decimal(18,5),
      MontoExportacion : Decimal(18,5),
      Exoneración : {
        Tipodocumento : String(2),
        NumeroDocumento : String(40),
        NombreInstitucion : String (160),
        FechaEmision : DateTime, // 2016-09-26T13:00:00+06:00
        PorcentajeExoneracion : Integer(3),
        MontoExoneracion : Decimal(18,5)
      }
    },
    ImpuestoNeto : Decimal(18,5),
    MontoTotalLinea : Decimal(18,5),
  },
  OtrosCargos : {
    TipoDocumento : String(2),
    NumeroIdentidadTercero : String(12),
    NombreTercero : String(100),
    Detalle : String(160),
    Porcentaje: Decimal(9,5),
    MontoCargo: Decimal(18,5),
  },
  ResumenFactura : {
    CodigoTipoMoneda : {
      CodigoMoneda : String(3),
      TipoCambio : Decimal(18,5),
    },
    TotalServGravados : Decimal(18,5),
    TotalServExentos : Decimal(18,5),
    TotalServExonerado : Decimal(18,5),
    TotalMercanciasGravadas : Decimal(18,5),
    TotalMercanciasExentas : Decimal(18,5),
    TotalMercExonerada : Decimal(18,5),
    TotalGravado : Decimal(18,5),
    TotalExento : Decimal(18,5),
    TotalExonerado : Decimal(18,5),
    TotalVenta : Decimal(18,5),
    TotalDescuentos : Decima(18,5),
    TotalVentaNeta : Decimal(18,5),
    TotalImpuesto: Decimal(18,5),
    TotalIVADevuelto : Decimal(18,5),
    TotalOtrosCargos : Decimal(18,5),
    TotalComprobante : Decimal(18,5)
  }
}
