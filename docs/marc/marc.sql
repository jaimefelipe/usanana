-- Formatos / versiones del diccionario

DROP TABLE IF EXISTS Bib_Marc_Dic_Formato;

CREATE TABLE Bib_Marc_Dic_Formato (
  Id_Formato     INT AUTO_INCREMENT PRIMARY KEY,
  Codigo         VARCHAR(50) NOT NULL UNIQUE,   -- 'MARC21-BIB'
  Nombre         VARCHAR(150) NOT NULL,         -- 'MARC 21 Bibliographic'
  Fuente         VARCHAR(150) NULL,             -- 'Library of Congress'
  Version        VARCHAR(50) NULL,              -- 'Update 41 (Dec 2025)' o lo que uses
  Url_Fuente     VARCHAR(255) NULL,
  Activo         TINYINT(1) NOT NULL DEFAULT 1,
  Creado_El      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Diccionario de campos (Tags)

DROP TABLE IF EXISTS Bib_Marc_Dic_Campo;

CREATE TABLE Bib_Marc_Dic_Campo (
  Id_Dic_Campo   BIGINT AUTO_INCREMENT PRIMARY KEY,
  Id_Formato     INT NOT NULL,
  Tag            CHAR(3) NOT NULL,              -- '001','245','650'
  Nombre         VARCHAR(255) NOT NULL,         -- 'Control Number', etc.
  Grupo          VARCHAR(10) NULL,              -- '00X','0XX','1XX','2XX','3XX'...
  Repetibilidad  ENUM('NR','R') NULL,           -- opcional (si la sabes)
  Es_Control     TINYINT(1) NOT NULL DEFAULT 0, -- 1 si 001-009
  Es_Obsoleto    TINYINT(1) NOT NULL DEFAULT 0, -- si lo manejas luego
  Orden          INT NULL,                      -- para ordenarlo en UI
  UNIQUE KEY uk_formato_tag (Id_Formato, Tag),
  INDEX idx_tag (Tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Diccionario de subcampos e indicadores

DROP TABLE IF EXISTS Bib_Marc_Dic_Subcampo;
CREATE TABLE Bib_Marc_Dic_Subcampo (
  Id_Dic_Subcampo BIGINT AUTO_INCREMENT PRIMARY KEY,
  Id_Formato      INT NOT NULL,
  Tag             CHAR(3) NOT NULL,
  Codigo          CHAR(1) NOT NULL,           -- 'a','b','c'...
  Nombre          VARCHAR(255) NOT NULL,
  Repetibilidad   ENUM('NR','R') NULL,
  Es_Obsoleto     TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uk_formato_tag_codigo (Id_Formato, Tag, Codigo),
  INDEX idx_tag (Tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS Bib_Marc_Dic_Indicador;
CREATE TABLE Bib_Marc_Dic_Indicador (
  Id_Dic_Indicador BIGINT AUTO_INCREMENT PRIMARY KEY,
  Id_Formato       INT NOT NULL,
  Tag              CHAR(3) NOT NULL,
  Posicion         TINYINT NOT NULL,          -- 1 o 2
  Valor            CHAR(1) NOT NULL,          -- '0','1',' '...
  Significado      VARCHAR(255) NOT NULL,
  UNIQUE KEY uk_formato_tag_pos_val (Id_Formato, Tag, Posicion, Valor),
  INDEX idx_tag (Tag)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Script MySQL para llenar el catálogo (Tags)
-- Paso 1: Insertar el formato MARC21-BIB
INSERT INTO Bib_Marc_Dic_Formato (Codigo, Nombre, Fuente, Version, Url_Fuente)
VALUES ('MARC21-BIB', 'MARC 21 Bibliographic', 'Library of Congress', 'Update 41 (Dec 2025)',
        'https://www.loc.gov/marc/bibliographic/')
ON DUPLICATE KEY UPDATE
  Nombre = VALUES(Nombre),
  Fuente = VALUES(Fuente),
  Version = VALUES(Version),
  Url_Fuente = VALUES(Url_Fuente),
  Activo = 1;

  -- Paso 2: Cargar los campos (diccionario de Tags)

  INSERT INTO Bib_Marc_Dic_Campo
(Id_Formato, Tag, Nombre, Grupo, Repetibilidad, Es_Control, Orden)
SELECT f.Id_Formato, x.Tag, x.Nombre, x.Grupo, x.Repetibilidad,
       CASE WHEN x.Tag < '010' THEN 1 ELSE 0 END AS Es_Control,
       x.Orden
FROM Bib_Marc_Dic_Formato f
JOIN (
  SELECT  1 Orden, '001' Tag, 'Control Number' Nombre, '00X' Grupo, 'NR' Repetibilidad UNION ALL
  SELECT  2, '003', 'Control Number Identifier', '00X', 'NR' UNION ALL
  SELECT  3, '005', 'Date and Time of Latest Transaction', '00X', 'NR' UNION ALL
  SELECT  4, '006', 'Fixed-Length Data Elements – Additional Material Characteristics', '00X', 'NR' UNION ALL
  SELECT  5, '007', 'Physical Description Fixed Field', '00X', 'NR' UNION ALL
  SELECT  6, '008', 'Fixed-Length Data Elements', '00X', 'NR' UNION ALL

  SELECT  7, '010', 'Library of Congress Control Number', '0XX', NULL UNION ALL
  SELECT  8, '013', 'Patent Control Information', '0XX', NULL UNION ALL
  SELECT  9, '015', 'National Bibliography Number', '0XX', NULL UNION ALL
  SELECT 10, '016', 'National Bibliographic Agency Control Number', '0XX', NULL UNION ALL
  SELECT 11, '017', 'Copyright or Legal Deposit Number', '0XX', NULL UNION ALL
  SELECT 12, '018', 'Copyright Article-Fee Code', '0XX', NULL UNION ALL
  SELECT 13, '020', 'International Standard Book Number (ISBN)', '0XX', NULL UNION ALL
  SELECT 14, '022', 'International Standard Serial Number (ISSN)', '0XX', NULL UNION ALL
  SELECT 15, '024', 'Other Standard Identifier', '0XX', NULL UNION ALL
  SELECT 16, '025', 'Overseas Acquisition Number', '0XX', NULL UNION ALL
  SELECT 17, '026', 'Fingerprint Identifier', '0XX', NULL UNION ALL
  SELECT 18, '027', 'Standard Technical Report Number', '0XX', NULL UNION ALL
  SELECT 19, '028', 'Publisher or Distributor Number', '0XX', NULL UNION ALL
  SELECT 20, '030', 'CODEN Designation', '0XX', NULL UNION ALL
  SELECT 21, '031', 'Musical Incipits Information', '0XX', NULL UNION ALL
  SELECT 22, '032', 'Postal Registration Number', '0XX', NULL UNION ALL
  SELECT 23, '033', 'Date/Time and Place of an Event', '0XX', NULL UNION ALL
  SELECT 24, '034', 'Coded Cartographic Mathematical Data', '0XX', NULL UNION ALL
  SELECT 25, '035', 'System Control Number', '0XX', NULL UNION ALL
  SELECT 26, '036', 'Original Study Number for Computer Data Files', '0XX', NULL UNION ALL
  SELECT 27, '037', 'Source of Acquisition', '0XX', NULL UNION ALL
  SELECT 28, '038', 'Record Content Licensor', '0XX', NULL UNION ALL
  SELECT 29, '040', 'Cataloging Source', '0XX', NULL UNION ALL
  SELECT 30, '041', 'Language Code', '0XX', NULL UNION ALL
  SELECT 31, '042', 'Authentication Code', '0XX', NULL UNION ALL
  SELECT 32, '043', 'Geographic Area Code', '0XX', NULL UNION ALL
  SELECT 33, '044', 'Country of Publishing/Producing Entity Code', '0XX', NULL UNION ALL
  SELECT 34, '045', 'Time Period of Content', '0XX', NULL UNION ALL
  SELECT 35, '046', 'Special Coded Dates', '0XX', NULL UNION ALL
  SELECT 36, '047', 'Form of Musical Composition Code', '0XX', NULL UNION ALL
  SELECT 37, '048', 'Number of Musical Instruments or Voices Code', '0XX', NULL UNION ALL
  SELECT 38, '050', 'Library of Congress Call Number', '0XX', NULL UNION ALL
  SELECT 39, '052', 'Geographic Classification', '0XX', NULL UNION ALL
  SELECT 40, '055', 'Classification Numbers Assigned in Canada', '0XX', NULL UNION ALL
  SELECT 41, '060', 'National Library of Medicine Call Number', '0XX', NULL UNION ALL
  SELECT 42, '061', 'National Library of Medicine Copy Statement', '0XX', NULL UNION ALL
  SELECT 43, '070', 'National Agricultural Library Call Number', '0XX', NULL UNION ALL
  SELECT 44, '071', 'National Agricultural Library Copy Statement', '0XX', NULL UNION ALL
  SELECT 45, '072', 'Subject Category Code', '0XX', NULL UNION ALL
  SELECT 46, '074', 'GPO Item Number', '0XX', NULL UNION ALL
  SELECT 47, '080', 'Universal Decimal Classification Number', '0XX', NULL UNION ALL
  SELECT 48, '082', 'Dewey Decimal Classification Number', '0XX', NULL UNION ALL
  SELECT 49, '083', 'Additional Dewey Decimal Classification Number', '0XX', NULL UNION ALL
  SELECT 50, '084', 'Other Classification Number', '0XX', NULL UNION ALL
  SELECT 51, '085', 'Synthesized Classification Number Components', '0XX', NULL UNION ALL
  SELECT 52, '086', 'Government Document Classification Number', '0XX', NULL UNION ALL
  SELECT 53, '088', 'Report Number', '0XX', NULL UNION ALL

  SELECT 54, '100', 'Main Entry – Personal Name', '1XX', 'NR' UNION ALL
  SELECT 55, '110', 'Main Entry – Corporate Name', '1XX', 'NR' UNION ALL
  SELECT 56, '111', 'Main Entry – Meeting Name', '1XX', 'NR' UNION ALL
  SELECT 57, '130', 'Main Entry – Uniform Title', '1XX', 'NR' UNION ALL

  SELECT 58, '240', 'Uniform Title', '2XX', 'NR' UNION ALL
  SELECT 59, '242', 'Translation of Title by Cataloging Agency', '2XX', NULL UNION ALL
  SELECT 60, '243', 'Collective Uniform Title', '2XX', NULL UNION ALL
  SELECT 61, '245', 'Title Statement', '2XX', 'NR' UNION ALL
  SELECT 62, '246', 'Varying Form of Title', '2XX', NULL UNION ALL
  SELECT 63, '247', 'Former Title', '2XX', NULL UNION ALL

  SELECT 64, '250', 'Edition Statement', '2XX', 'NR' UNION ALL
  SELECT 65, '254', 'Musical Presentation Statement', '2XX', NULL UNION ALL
  SELECT 66, '255', 'Cartographic Mathematical Data', '2XX', NULL UNION ALL
  SELECT 67, '256', 'Computer File Characteristics', '2XX', NULL UNION ALL
  SELECT 68, '257', 'Country of Producing Entity', '2XX', NULL UNION ALL
  SELECT 69, '258', 'Philatelic Issue Data', '2XX', NULL UNION ALL
  SELECT 70, '260', 'Publication, Distribution, etc. (Imprint)', '2XX', NULL UNION ALL
  SELECT 71, '263', 'Projected Publication Date', '2XX', NULL UNION ALL
  SELECT 72, '264', 'Production, Publication, Distribution, Manufacture, and Copyright Notice', '2XX', NULL UNION ALL
  SELECT 73, '270', 'Address', '2XX', NULL UNION ALL

  SELECT 74, '300', 'Physical Description', '3XX', NULL UNION ALL
  SELECT 75, '306', 'Playing Time', '3XX', NULL UNION ALL
  SELECT 76, '307', 'Hours, etc.', '3XX', NULL UNION ALL
  SELECT 77, '310', 'Current Publication Frequency', '3XX', NULL UNION ALL
  SELECT 78, '321', 'Former Publication Frequency', '3XX', NULL UNION ALL
  SELECT 79, '336', 'Content Type', '3XX', NULL UNION ALL
  SELECT 80, '337', 'Media Type', '3XX', NULL UNION ALL
  SELECT 81, '338', 'Carrier Type', '3XX', NULL UNION ALL

  SELECT 82, '490', 'Series Statement', '4XX', NULL UNION ALL

  SELECT 83, '500', 'General Note', '5XX', 'R' UNION ALL
  SELECT 84, '501', 'With Note', '5XX', 'R' UNION ALL
  SELECT 85, '502', 'Dissertation Note', '5XX', 'R' UNION ALL
  SELECT 86, '504', 'Bibliography, etc. Note', '5XX', 'R' UNION ALL
  SELECT 87, '505', 'Formatted Contents Note', '5XX', 'R' UNION ALL
  SELECT 88, '506', 'Restrictions on Access Note', '5XX', 'R' UNION ALL
  SELECT 89, '507', 'Scale Note for Graphic Material', '5XX', 'R' UNION ALL
  SELECT 90, '508', 'Creation/Production Credits Note', '5XX', 'R' UNION ALL
  SELECT 91, '510', 'Citation/References Note', '5XX', 'R' UNION ALL
  SELECT 92, '511', 'Participant or Performer Note', '5XX', 'R' UNION ALL
  SELECT 93, '513', 'Type of Report and Period Covered Note', '5XX', 'R' UNION ALL
  SELECT 94, '514', 'Data Quality Note', '5XX', 'R' UNION ALL
  SELECT 95, '515', 'Numbering Peculiarities Note', '5XX', 'R' UNION ALL
  SELECT 96, '516', 'Type of Computer File or Data Note', '5XX', 'R' UNION ALL
  SELECT 97, '518', 'Date/Time and Place of an Event Note', '5XX', 'R' UNION ALL
  SELECT 98, '520', 'Summary, etc.', '5XX', 'R' UNION ALL
  SELECT 99, '521', 'Target Audience Note', '5XX', 'R' UNION ALL
  SELECT 100,'522', 'Geographic Coverage Note', '5XX', 'R' UNION ALL
  SELECT 101,'524', 'Preferred Citation of Described Materials Note', '5XX', 'R' UNION ALL
  SELECT 102,'525', 'Supplement Note', '5XX', 'R' UNION ALL
  SELECT 103,'526', 'Study Program Information Note', '5XX', 'R' UNION ALL
  SELECT 104,'530', 'Additional Physical Form Available Note', '5XX', 'R' UNION ALL
  SELECT 105,'533', 'Reproduction Note', '5XX', 'R' UNION ALL
  SELECT 106,'534', 'Original Version Note', '5XX', 'R' UNION ALL
  SELECT 107,'538', 'System Details Note', '5XX', 'R' UNION ALL
  SELECT 108,'540', 'Terms Governing Use and Reproduction Note', '5XX', 'R' UNION ALL
  SELECT 109,'546', 'Language Note', '5XX', 'R' UNION ALL
  SELECT 110,'547', 'Former Title Complexity Note', '5XX', 'R' UNION ALL
  SELECT 111,'550', 'Issuing Body Note', '5XX', 'R' UNION ALL
  SELECT 112,'555', 'Cumulative Index/Finding Aids Note', '5XX', 'R' UNION ALL
  SELECT 113,'561', 'Ownership and Custodial History', '5XX', 'R' UNION ALL
  SELECT 114,'563', 'Binding Information', '5XX', 'R' UNION ALL
  SELECT 115,'585', 'Exhibitions Note', '5XX', 'R' UNION ALL

  SELECT 116,'600', 'Subject Added Entry – Personal Name', '6XX', 'R' UNION ALL
  SELECT 117,'610', 'Subject Added Entry – Corporate Name', '6XX', 'R' UNION ALL
  SELECT 118,'611', 'Subject Added Entry – Meeting Name', '6XX', 'R' UNION ALL
  SELECT 119,'630', 'Subject Added Entry – Uniform Title', '6XX', 'R' UNION ALL
  SELECT 120,'647', 'Subject Added Entry – Named Event', '6XX', 'R' UNION ALL
  SELECT 121,'648', 'Subject Added Entry – Chronological Term', '6XX', 'R' UNION ALL
  SELECT 122,'650', 'Subject Added Entry – Topical Term', '6XX', 'R' UNION ALL
  SELECT 123,'651', 'Subject Added Entry – Geographic Name', '6XX', 'R' UNION ALL
  SELECT 124,'653', 'Index Term – Uncontrolled', '6XX', 'R' UNION ALL
  SELECT 125,'654', 'Subject Added Entry – Faceted Topical Terms', '6XX', 'R' UNION ALL
  SELECT 126,'655', 'Index Term – Genre/Form', '6XX', 'R' UNION ALL

  SELECT 127,'700', 'Added Entry – Personal Name', '7XX', 'R' UNION ALL
  SELECT 128,'710', 'Added Entry – Corporate Name', '7XX', 'R' UNION ALL
  SELECT 129,'711', 'Added Entry – Meeting Name', '7XX', 'R' UNION ALL
  SELECT 130,'720', 'Added Entry – Uncontrolled Name', '7XX', 'R' UNION ALL
  SELECT 131,'730', 'Added Entry – Uniform Title', '7XX', 'R' UNION ALL
  SELECT 132,'740', 'Added Entry – Uncontrolled Related/Analytical Title', '7XX', 'R' UNION ALL
  SELECT 133,'751', 'Added Entry – Geographic Name', '7XX', 'R' UNION ALL
  SELECT 134,'752', 'Added Entry – Hierarchical Place Name', '7XX', 'R' UNION ALL
  SELECT 135,'753', 'System Details Access to Computer Files', '7XX', 'R' UNION ALL

  SELECT 136,'800', 'Series Added Entry – Personal Name', '8XX', 'R' UNION ALL
  SELECT 137,'810', 'Series Added Entry – Corporate Name', '8XX', 'R' UNION ALL
  SELECT 138,'811', 'Series Added Entry – Meeting Name', '8XX', 'R' UNION ALL
  SELECT 139,'830', 'Series Added Entry – Uniform Title', '8XX', 'R'
) x
WHERE f.Codigo = 'MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Nombre = VALUES(Nombre),
  Grupo = VALUES(Grupo),
  Repetibilidad = VALUES(Repetibilidad),
  Es_Control = VALUES(Es_Control),
  Orden = VALUES(Orden);


/* =========================================================
   CARGA DICCIONARIO DE SUBCAMPOS MARC21-BIB (CORE FASE 1)
   Tabla destino: Bib_Marc_Dic_Subcampo
   Requiere: Bib_Marc_Dic_Formato con Codigo='MARC21-BIB'
   ========================================================= */

INSERT INTO Bib_Marc_Dic_Subcampo
(Id_Formato, Tag, Codigo, Nombre, Repetibilidad, Es_Obsoleto)
SELECT f.Id_Formato, x.Tag, x.Codigo, x.Nombre, x.Rep, 0
FROM Bib_Marc_Dic_Formato f
JOIN (
  /* ---------------------------
     020 - ISBN
     --------------------------- */
  SELECT '020' Tag,'a' Codigo,'International Standard Book Number' Nombre,'R' Rep UNION ALL
  SELECT '020','c','Terms of availability','R' UNION ALL
  SELECT '020','q','Qualifying information','R' UNION ALL
  SELECT '020','z','Canceled/invalid ISBN','R' UNION ALL
  SELECT '020','6','Linkage','NR' UNION ALL
  SELECT '020','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     040 - Cataloging Source
     --------------------------- */
  SELECT '040','a','Original cataloging agency','NR' UNION ALL
  SELECT '040','b','Language of cataloging','NR' UNION ALL
  SELECT '040','c','Transcribing agency','NR' UNION ALL
  SELECT '040','d','Modifying agency','R' UNION ALL
  SELECT '040','e','Description conventions','R' UNION ALL
  SELECT '040','6','Linkage','NR' UNION ALL
  SELECT '040','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     041 - Language Code
     --------------------------- */
  SELECT '041','a','Language code of text/sound track or separate title','R' UNION ALL
  SELECT '041','b','Language code of summary or abstract','R' UNION ALL
  SELECT '041','d','Language code of sung or spoken text','R' UNION ALL
  SELECT '041','e','Language code of librettos','R' UNION ALL
  SELECT '041','f','Language code of table of contents','R' UNION ALL
  SELECT '041','g','Language code of accompanying material other than librettos','R' UNION ALL
  SELECT '041','h','Language code of original','R' UNION ALL
  SELECT '041','j','Language code of subtitles or captions','R' UNION ALL
  SELECT '041','k','Language code of intermediate translations','R' UNION ALL
  SELECT '041','m','Language code of original accompanying material other than librettos','R' UNION ALL
  SELECT '041','n','Language code of original libretto','R' UNION ALL
  SELECT '041','2','Source of code','NR' UNION ALL
  SELECT '041','6','Linkage','NR' UNION ALL
  SELECT '041','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     100 - Main Entry - Personal Name
     (subcampos típicos de X00)
     --------------------------- */
  SELECT '100','a','Personal name','NR' UNION ALL
  SELECT '100','b','Numeration','NR' UNION ALL
  SELECT '100','c','Titles and other words associated with a name','R' UNION ALL
  SELECT '100','d','Dates associated with a name','NR' UNION ALL
  SELECT '100','e','Relator term','R' UNION ALL
  SELECT '100','f','Date of a work','NR' UNION ALL
  SELECT '100','g','Miscellaneous information','NR' UNION ALL
  SELECT '100','j','Attribution qualifier','R' UNION ALL
  SELECT '100','k','Form subheading','R' UNION ALL
  SELECT '100','l','Language of a work','NR' UNION ALL
  SELECT '100','n','Number of part/section of a work','R' UNION ALL
  SELECT '100','p','Name of part/section of a work','R' UNION ALL
  SELECT '100','q','Fuller form of name','NR' UNION ALL
  SELECT '100','t','Title of a work','NR' UNION ALL
  SELECT '100','u','Affiliation','NR' UNION ALL
  SELECT '100','0','Authority record control number or standard number','R' UNION ALL
  SELECT '100','1','Real World Object URI','R' UNION ALL
  SELECT '100','2','Source of heading or term','NR' UNION ALL
  SELECT '100','3','Materials specified','NR' UNION ALL
  SELECT '100','4','Relationship','R' UNION ALL
  SELECT '100','5','Institution to which field applies','NR' UNION ALL
  SELECT '100','6','Linkage','NR' UNION ALL
  SELECT '100','7','Data provenance','R' UNION ALL
  SELECT '100','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     245 - Title Statement
     --------------------------- */
  SELECT '245','a','Title','NR' UNION ALL
  SELECT '245','b','Remainder of title','NR' UNION ALL
  SELECT '245','c','Statement of responsibility, etc.','NR' UNION ALL
  SELECT '245','f','Inclusive dates','NR' UNION ALL
  SELECT '245','g','Bulk dates','NR' UNION ALL
  SELECT '245','h','Medium','NR' UNION ALL
  SELECT '245','k','Form','R' UNION ALL
  SELECT '245','n','Number of part/section of a work','R' UNION ALL
  SELECT '245','p','Name of part/section of a work','R' UNION ALL
  SELECT '245','s','Version','NR' UNION ALL
  SELECT '245','6','Linkage','NR' UNION ALL
  SELECT '245','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     250 - Edition Statement
     --------------------------- */
  SELECT '250','a','Edition statement','NR' UNION ALL
  SELECT '250','b','Remainder of edition statement','NR' UNION ALL
  SELECT '250','6','Linkage','NR' UNION ALL
  SELECT '250','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     264 - Production/Publication/Distribution/Manufacture/Copyright
     --------------------------- */
  SELECT '264','a','Place of production, publication, distribution, manufacture','R' UNION ALL
  SELECT '264','b','Name of producer, publisher, distributor, manufacturer','R' UNION ALL
  SELECT '264','c','Date of production, publication, distribution, manufacture, or copyright notice','R' UNION ALL
  SELECT '264','3','Materials specified','NR' UNION ALL
  SELECT '264','6','Linkage','NR' UNION ALL
  SELECT '264','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     300 - Physical Description
     --------------------------- */
  SELECT '300','a','Extent','R' UNION ALL
  SELECT '300','b','Other physical details','R' UNION ALL
  SELECT '300','c','Dimensions','R' UNION ALL
  SELECT '300','e','Accompanying material','R' UNION ALL
  SELECT '300','f','Type of unit','R' UNION ALL
  SELECT '300','g','Size of unit','R' UNION ALL
  SELECT '300','3','Materials specified','NR' UNION ALL
  SELECT '300','6','Linkage','NR' UNION ALL
  SELECT '300','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     336 - Content Type (RDA)
     --------------------------- */
  SELECT '336','a','Content type term','R' UNION ALL
  SELECT '336','b','Content type code','R' UNION ALL
  SELECT '336','0','Authority record control number or standard number','R' UNION ALL
  SELECT '336','2','Source','NR' UNION ALL
  SELECT '336','3','Materials specified','NR' UNION ALL
  SELECT '336','6','Linkage','NR' UNION ALL
  SELECT '336','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     337 - Media Type (RDA)
     --------------------------- */
  SELECT '337','a','Media type term','R' UNION ALL
  SELECT '337','b','Media type code','R' UNION ALL
  SELECT '337','0','Authority record control number or standard number','R' UNION ALL
  SELECT '337','2','Source','NR' UNION ALL
  SELECT '337','3','Materials specified','NR' UNION ALL
  SELECT '337','6','Linkage','NR' UNION ALL
  SELECT '337','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     338 - Carrier Type (RDA)
     --------------------------- */
  SELECT '338','a','Carrier type term','R' UNION ALL
  SELECT '338','b','Carrier type code','R' UNION ALL
  SELECT '338','0','Authority record control number or standard number','R' UNION ALL
  SELECT '338','2','Source','NR' UNION ALL
  SELECT '338','3','Materials specified','NR' UNION ALL
  SELECT '338','6','Linkage','NR' UNION ALL
  SELECT '338','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     490 - Series Statement
     --------------------------- */
  SELECT '490','a','Series statement','R' UNION ALL
  SELECT '490','l','Library of Congress call number','R' UNION ALL
  SELECT '490','v','Volume/sequential designation','R' UNION ALL
  SELECT '490','x','International Standard Serial Number','R' UNION ALL
  SELECT '490','3','Materials specified','NR' UNION ALL
  SELECT '490','6','Linkage','NR' UNION ALL
  SELECT '490','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     830 - Series Added Entry - Uniform Title
     (core de serie)
     --------------------------- */
  SELECT '830','a','Uniform title','NR' UNION ALL
  SELECT '830','v','Volume/sequential designation','R' UNION ALL
  SELECT '830','x','International Standard Serial Number','R' UNION ALL
  SELECT '830','0','Authority record control number or standard number','R' UNION ALL
  SELECT '830','1','Real World Object URI','R' UNION ALL
  SELECT '830','2','Source of heading or term','NR' UNION ALL
  SELECT '830','3','Materials specified','NR' UNION ALL
  SELECT '830','4','Relationship','R' UNION ALL
  SELECT '830','5','Institution to which field applies','NR' UNION ALL
  SELECT '830','6','Linkage','NR' UNION ALL
  SELECT '830','7','Data provenance','R' UNION ALL
  SELECT '830','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     500 - General Note
     --------------------------- */
  SELECT '500','a','General note','R' UNION ALL
  SELECT '500','3','Materials specified','NR' UNION ALL
  SELECT '500','5','Institution to which field applies','NR' UNION ALL
  SELECT '500','6','Linkage','NR' UNION ALL
  SELECT '500','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     504 - Bibliography, etc. Note
     --------------------------- */
  SELECT '504','a','Bibliography, etc. note','R' UNION ALL
  SELECT '504','b','Number of references','R' UNION ALL
  SELECT '504','6','Linkage','NR' UNION ALL
  SELECT '504','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     505 - Formatted Contents Note
     --------------------------- */
  SELECT '505','a','Formatted contents note','R' UNION ALL
  SELECT '505','g','Miscellaneous information','R' UNION ALL
  SELECT '505','r','Statement of responsibility','R' UNION ALL
  SELECT '505','t','Title','R' UNION ALL
  SELECT '505','u','Uniform Resource Identifier','R' UNION ALL
  SELECT '505','6','Linkage','NR' UNION ALL
  SELECT '505','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     520 - Summary, etc.
     --------------------------- */
  SELECT '520','a','Summary, etc. note','R' UNION ALL
  SELECT '520','b','Expansion of summary note','R' UNION ALL
  SELECT '520','c','Assigning source','NR' UNION ALL
  SELECT '520','2','Source','NR' UNION ALL
  SELECT '520','3','Materials specified','NR' UNION ALL
  SELECT '520','6','Linkage','NR' UNION ALL
  SELECT '520','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     650 - Subject Added Entry - Topical Term
     --------------------------- */
  SELECT '650','a','Topical term or geographic name entry element','NR' UNION ALL
  SELECT '650','b','Topical term following geographic name entry element','NR' UNION ALL
  SELECT '650','c','Location of event','NR' UNION ALL
  SELECT '650','d','Active dates','NR' UNION ALL
  SELECT '650','e','Relator term','R' UNION ALL
  SELECT '650','0','Authority record control number or standard number','R' UNION ALL
  SELECT '650','1','Real World Object URI','R' UNION ALL
  SELECT '650','2','Source of heading or term','NR' UNION ALL
  SELECT '650','3','Materials specified','NR' UNION ALL
  SELECT '650','4','Relationship','R' UNION ALL
  SELECT '650','5','Institution to which field applies','NR' UNION ALL
  SELECT '650','6','Linkage','NR' UNION ALL
  SELECT '650','7','Data provenance','R' UNION ALL
  SELECT '650','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     651 - Subject Added Entry - Geographic Name
     --------------------------- */
  SELECT '651','a','Geographic name','NR' UNION ALL
  SELECT '651','v','Form subdivision','R' UNION ALL
  SELECT '651','x','General subdivision','R' UNION ALL
  SELECT '651','y','Chronological subdivision','R' UNION ALL
  SELECT '651','z','Geographic subdivision','R' UNION ALL
  SELECT '651','0','Authority record control number or standard number','R' UNION ALL
  SELECT '651','1','Real World Object URI','R' UNION ALL
  SELECT '651','2','Source of heading or term','NR' UNION ALL
  SELECT '651','3','Materials specified','NR' UNION ALL
  SELECT '651','4','Relationship','R' UNION ALL
  SELECT '651','5','Institution to which field applies','NR' UNION ALL
  SELECT '651','6','Linkage','NR' UNION ALL
  SELECT '651','7','Data provenance','R' UNION ALL
  SELECT '651','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     655 - Index Term - Genre/Form
     --------------------------- */
  SELECT '655','a','Genre/form term','NR' UNION ALL
  SELECT '655','b','Non-focus term','NR' UNION ALL
  SELECT '655','c','Facet/hierarchy designation','NR' UNION ALL
  SELECT '655','v','Form subdivision','R' UNION ALL
  SELECT '655','x','General subdivision','R' UNION ALL
  SELECT '655','y','Chronological subdivision','R' UNION ALL
  SELECT '655','z','Geographic subdivision','R' UNION ALL
  SELECT '655','0','Authority record control number or standard number','R' UNION ALL
  SELECT '655','1','Real World Object URI','R' UNION ALL
  SELECT '655','2','Source of term','NR' UNION ALL
  SELECT '655','3','Materials specified','NR' UNION ALL
  SELECT '655','4','Relationship','R' UNION ALL
  SELECT '655','5','Institution to which field applies','NR' UNION ALL
  SELECT '655','6','Linkage','NR' UNION ALL
  SELECT '655','7','Data provenance','R' UNION ALL
  SELECT '655','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     700 - Added Entry - Personal Name
     --------------------------- */
  SELECT '700','a','Personal name','NR' UNION ALL
  SELECT '700','b','Numeration','NR' UNION ALL
  SELECT '700','c','Titles and other words associated with a name','R' UNION ALL
  SELECT '700','d','Dates associated with a name','NR' UNION ALL
  SELECT '700','e','Relator term','R' UNION ALL
  SELECT '700','f','Date of a work','NR' UNION ALL
  SELECT '700','g','Miscellaneous information','NR' UNION ALL
  SELECT '700','h','Medium','NR' UNION ALL
  SELECT '700','i','Relationship information','R' UNION ALL
  SELECT '700','j','Attribution qualifier','R' UNION ALL
  SELECT '700','k','Form subheading','R' UNION ALL
  SELECT '700','l','Language of a work','NR' UNION ALL
  SELECT '700','m','Medium of performance for music','R' UNION ALL
  SELECT '700','n','Number of part/section of a work','R' UNION ALL
  SELECT '700','o','Arranged statement for music','NR' UNION ALL
  SELECT '700','p','Name of part/section of a work','R' UNION ALL
  SELECT '700','q','Fuller form of name','NR' UNION ALL
  SELECT '700','r','Key for music','NR' UNION ALL
  SELECT '700','s','Version','NR' UNION ALL
  SELECT '700','t','Title of a work','NR' UNION ALL
  SELECT '700','u','Affiliation','NR' UNION ALL
  SELECT '700','x','International Standard Serial Number','R' UNION ALL
  SELECT '700','0','Authority record control number or standard number','R' UNION ALL
  SELECT '700','1','Real World Object URI','R' UNION ALL
  SELECT '700','2','Source of heading or term','NR' UNION ALL
  SELECT '700','3','Materials specified','NR' UNION ALL
  SELECT '700','4','Relationship','R' UNION ALL
  SELECT '700','5','Institution to which field applies','NR' UNION ALL
  SELECT '700','6','Linkage','NR' UNION ALL
  SELECT '700','7','Data provenance','R' UNION ALL
  SELECT '700','8','Field link and sequence number','R'
) x
WHERE f.Codigo = 'MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Nombre = VALUES(Nombre),
  Repetibilidad = VALUES(Repetibilidad),
  Es_Obsoleto = VALUES(Es_Obsoleto);


/* =========================================================
   CARGA ADICIONAL (DELTA) - SUBCAMPOS CORE FALTANTES
   Formato: MARC21-BIB
   ========================================================= */

INSERT INTO Bib_Marc_Dic_Subcampo
(Id_Formato, Tag, Codigo, Nombre, Repetibilidad, Es_Obsoleto)
SELECT f.Id_Formato, x.Tag, x.Codigo, x.Nombre, x.Rep, 0
FROM Bib_Marc_Dic_Formato f
JOIN (
  /* ---------------------------
     260 - Publication, Distribution, etc. (Imprint)
     (Útil si tu biblioteca aún usa 260 además de 264)
     --------------------------- */
  SELECT '260' Tag,'a' Codigo,'Place of publication, distribution, etc.' Nombre,'R' Rep UNION ALL
  SELECT '260','b','Name of publisher, distributor, etc.','R' UNION ALL
  SELECT '260','c','Date of publication, distribution, etc.','R' UNION ALL
  SELECT '260','e','Place of manufacture','R' UNION ALL
  SELECT '260','f','Manufacturer','R' UNION ALL
  SELECT '260','g','Date of manufacture','R' UNION ALL
  SELECT '260','3','Materials specified','NR' UNION ALL
  SELECT '260','6','Linkage','NR' UNION ALL
  SELECT '260','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     310 - Current Publication Frequency
     --------------------------- */
  SELECT '310','a','Current publication frequency','NR' UNION ALL
  SELECT '310','b','Date of current publication frequency','NR' UNION ALL
  SELECT '310','6','Linkage','NR' UNION ALL
  SELECT '310','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     321 - Former Publication Frequency
     --------------------------- */
  SELECT '321','a','Former publication frequency','NR' UNION ALL
  SELECT '321','b','Dates of former publication frequency','NR' UNION ALL
  SELECT '321','6','Linkage','NR' UNION ALL
  SELECT '321','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     506 - Restrictions on Access Note
     --------------------------- */
  SELECT '506','a','Terms governing access','R' UNION ALL
  SELECT '506','b','Jurisdiction','R' UNION ALL
  SELECT '506','c','Physical access provisions','R' UNION ALL
  SELECT '506','d','Authorized users','R' UNION ALL
  SELECT '506','e','Authorization','R' UNION ALL
  SELECT '506','f','Standardized terminology for access restriction','R' UNION ALL
  SELECT '506','g','Availability date','R' UNION ALL
  SELECT '506','2','Source of term','NR' UNION ALL
  SELECT '506','3','Materials specified','NR' UNION ALL
  SELECT '506','5','Institution to which field applies','NR' UNION ALL
  SELECT '506','6','Linkage','NR' UNION ALL
  SELECT '506','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     538 - System Details Note
     --------------------------- */
  SELECT '538','a','System details note','R' UNION ALL
  SELECT '538','i','Display text','R' UNION ALL
  SELECT '538','u','Uniform Resource Identifier','R' UNION ALL
  SELECT '538','3','Materials specified','NR' UNION ALL
  SELECT '538','5','Institution to which field applies','NR' UNION ALL
  SELECT '538','6','Linkage','NR' UNION ALL
  SELECT '538','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     540 - Terms Governing Use and Reproduction Note
     --------------------------- */
  SELECT '540','a','Terms governing use and reproduction','R' UNION ALL
  SELECT '540','b','Jurisdiction','R' UNION ALL
  SELECT '540','c','Authorization','R' UNION ALL
  SELECT '540','d','Authorized users','R' UNION ALL
  SELECT '540','f','Standardized terminology for use and reproduction rights','R' UNION ALL
  SELECT '540','g','Availability date','R' UNION ALL
  SELECT '540','l','Status','R' UNION ALL
  SELECT '540','n','Note','R' UNION ALL
  SELECT '540','o','Type of license','R' UNION ALL
  SELECT '540','r','Standardized terminology for use and reproduction rights (URI)','R' UNION ALL
  SELECT '540','t','Identifier for terms governing use and reproduction','R' UNION ALL
  SELECT '540','u','Uniform Resource Identifier','R' UNION ALL
  SELECT '540','2','Source of term','NR' UNION ALL
  SELECT '540','3','Materials specified','NR' UNION ALL
  SELECT '540','5','Institution to which field applies','NR' UNION ALL
  SELECT '540','6','Linkage','NR' UNION ALL
  SELECT '540','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     546 - Language Note
     --------------------------- */
  SELECT '546','a','Language note','R' UNION ALL
  SELECT '546','b','Information code or alphabet','R' UNION ALL
  SELECT '546','3','Materials specified','NR' UNION ALL
  SELECT '546','6','Linkage','NR' UNION ALL
  SELECT '546','8','Field link and sequence number','R'
) x
WHERE f.Codigo = 'MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Nombre = VALUES(Nombre),
  Repetibilidad = VALUES(Repetibilidad),
  Es_Obsoleto = VALUES(Es_Obsoleto);


/* =========================================================
   CARGA ADICIONAL - SUBCAMPOS CORE+ (050, 082, 043, 044, 072, 074, 080, 856)
   Formato: MARC21-BIB
   ========================================================= */

INSERT INTO Bib_Marc_Dic_Subcampo
(Id_Formato, Tag, Codigo, Nombre, Repetibilidad, Es_Obsoleto)
SELECT f.Id_Formato, x.Tag, x.Codigo, x.Nombre, x.Rep, 0
FROM Bib_Marc_Dic_Formato f
JOIN (
  /* ---------------------------
     050 - Library of Congress Call Number
     --------------------------- */
  SELECT '050' Tag,'a' Codigo,'Classification number' Nombre,'NR' Rep UNION ALL
  SELECT '050','b','Item number','NR' UNION ALL
  SELECT '050','3','Materials specified','NR' UNION ALL
  SELECT '050','6','Linkage','NR' UNION ALL
  SELECT '050','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     082 - Dewey Decimal Classification Number
     --------------------------- */
  SELECT '082','a','Classification number' ,'NR' UNION ALL
  SELECT '082','b','Item number','NR' UNION ALL
  SELECT '082','m','Standard or optional designation','NR' UNION ALL
  SELECT '082','q','Assigning agency','NR' UNION ALL
  SELECT '082','2','Edition number','NR' UNION ALL
  SELECT '082','6','Linkage','NR' UNION ALL
  SELECT '082','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     043 - Geographic Area Code
     --------------------------- */
  SELECT '043','a','Geographic area code','R' UNION ALL
  SELECT '043','b','Local GAC code','R' UNION ALL
  SELECT '043','c','ISO code','R' UNION ALL
  SELECT '043','2','Source of local code','NR' UNION ALL
  SELECT '043','6','Linkage','NR' UNION ALL
  SELECT '043','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     044 - Country of Publishing/Producing Entity Code
     --------------------------- */
  SELECT '044','a','MARC country code','R' UNION ALL
  SELECT '044','b','Local subentity code','R' UNION ALL
  SELECT '044','c','ISO country code','R' UNION ALL
  SELECT '044','2','Source of local code','NR' UNION ALL
  SELECT '044','6','Linkage','NR' UNION ALL
  SELECT '044','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     072 - Subject Category Code
     --------------------------- */
  SELECT '072','a','Subject category code','R' UNION ALL
  SELECT '072','x','Subject category code subdivision','R' UNION ALL
  SELECT '072','2','Source','NR' UNION ALL
  SELECT '072','6','Linkage','NR' UNION ALL
  SELECT '072','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     074 - GPO Item Number
     --------------------------- */
  SELECT '074','a','GPO item number','R' UNION ALL
  SELECT '074','z','Canceled/invalid GPO item number','R' UNION ALL
  SELECT '074','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     080 - Universal Decimal Classification Number
     --------------------------- */
  SELECT '080','a','Universal Decimal Classification number','R' UNION ALL
  SELECT '080','b','Item number','NR' UNION ALL
  SELECT '080','x','Common auxiliary subdivision','R' UNION ALL
  SELECT '080','2','Edition identifier','NR' UNION ALL
  SELECT '080','6','Linkage','NR' UNION ALL
  SELECT '080','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     856 - Electronic Location and Access
     (muy usado para enlaces a PDFs, repositorios, recursos digitales)
     --------------------------- */
  SELECT '856','a','Host name','R' UNION ALL
  SELECT '856','b','Access number','R' UNION ALL
  SELECT '856','c','Compression information','R' UNION ALL
  SELECT '856','d','Path','R' UNION ALL
  SELECT '856','f','Electronic name','R' UNION ALL
  SELECT '856','h','Processor of request','NR' UNION ALL
  SELECT '856','i','Instruction','R' UNION ALL
  SELECT '856','j','Bits per second','R' UNION ALL
  SELECT '856','k','Password','NR' UNION ALL
  SELECT '856','l','Logon','NR' UNION ALL
  SELECT '856','m','Contact for access assistance','R' UNION ALL
  SELECT '856','n','Name of location of host','NR' UNION ALL
  SELECT '856','o','Operating system','NR' UNION ALL
  SELECT '856','p','Port','NR' UNION ALL
  SELECT '856','q','Electronic format type','NR' UNION ALL
  SELECT '856','r','Settings','NR' UNION ALL
  SELECT '856','s','File size','R' UNION ALL
  SELECT '856','t','Terminal emulation','R' UNION ALL
  SELECT '856','u','Uniform Resource Identifier (URI)','R' UNION ALL
  SELECT '856','v','Hours access method available','R' UNION ALL
  SELECT '856','w','Record control number','R' UNION ALL
  SELECT '856','x','Nonpublic note','R' UNION ALL
  SELECT '856','y','Link text','R' UNION ALL
  SELECT '856','z','Public note','R' UNION ALL
  SELECT '856','2','Access method','NR' UNION ALL
  SELECT '856','3','Materials specified','NR' UNION ALL
  SELECT '856','6','Linkage','NR' UNION ALL
  SELECT '856','7','Access status','NR' UNION ALL
  SELECT '856','8','Field link and sequence number','R'
) x
WHERE f.Codigo = 'MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Nombre = VALUES(Nombre),
  Repetibilidad = VALUES(Repetibilidad),
  Es_Obsoleto = VALUES(Es_Obsoleto);


/* =========================================================
   CARGA ADICIONAL - SUBCAMPOS BLOQUE SIGUIENTE (CORE++)
   Tags: 010, 022, 024, 090, 110, 111, 246, 710, 711, 773, 787
   Formato: MARC21-BIB
   ========================================================= */

INSERT INTO Bib_Marc_Dic_Subcampo
(Id_Formato, Tag, Codigo, Nombre, Repetibilidad, Es_Obsoleto)
SELECT f.Id_Formato, x.Tag, x.Codigo, x.Nombre, x.Rep, 0
FROM Bib_Marc_Dic_Formato f
JOIN (
  /* ---------------------------
     010 - Library of Congress Control Number (LCCN)
     --------------------------- */
  SELECT '010' Tag,'a' Codigo,'LC control number' Nombre,'R' Rep UNION ALL
  SELECT '010','b','NUCMC control number','R' UNION ALL
  SELECT '010','z','Canceled/invalid LC control number','R' UNION ALL
  SELECT '010','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     022 - International Standard Serial Number (ISSN)
     --------------------------- */
  SELECT '022','a','International Standard Serial Number','R' UNION ALL
  SELECT '022','l','ISSN-L','NR' UNION ALL
  SELECT '022','m','Canceled ISSN-L','R' UNION ALL
  SELECT '022','y','Incorrect ISSN','R' UNION ALL
  SELECT '022','z','Canceled ISSN','R' UNION ALL
  SELECT '022','2','Source','NR' UNION ALL
  SELECT '022','6','Linkage','NR' UNION ALL
  SELECT '022','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     024 - Other Standard Identifier (DOI, UPC, etc.)
     --------------------------- */
  SELECT '024','a','Standard number or code','R' UNION ALL
  SELECT '024','c','Terms of availability','R' UNION ALL
  SELECT '024','d','Additional codes following the standard number or code','R' UNION ALL
  SELECT '024','q','Qualifying information','R' UNION ALL
  SELECT '024','z','Canceled/invalid standard number or code','R' UNION ALL
  SELECT '024','2','Source of number or code','NR' UNION ALL
  SELECT '024','6','Linkage','NR' UNION ALL
  SELECT '024','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     090 - Local Call Number (muy usado como signatura local)
     --------------------------- */
  SELECT '090','a','Classification number (Local)','NR' UNION ALL
  SELECT '090','b','Item number (Local)','NR' UNION ALL
  SELECT '090','6','Linkage','NR' UNION ALL
  SELECT '090','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     110 - Main Entry - Corporate Name (X10)
     --------------------------- */
  SELECT '110','a','Corporate name or jurisdiction name as entry element','NR' UNION ALL
  SELECT '110','b','Subordinate unit','R' UNION ALL
  SELECT '110','c','Location of meeting','NR' UNION ALL
  SELECT '110','d','Date of meeting or treaty signing','NR' UNION ALL
  SELECT '110','e','Relator term','R' UNION ALL
  SELECT '110','f','Date of a work','NR' UNION ALL
  SELECT '110','g','Miscellaneous information','NR' UNION ALL
  SELECT '110','k','Form subheading','R' UNION ALL
  SELECT '110','l','Language of a work','NR' UNION ALL
  SELECT '110','n','Number of part/section/meeting','R' UNION ALL
  SELECT '110','p','Name of part/section of a work','R' UNION ALL
  SELECT '110','t','Title of a work','NR' UNION ALL
  SELECT '110','u','Affiliation','NR' UNION ALL
  SELECT '110','0','Authority record control number or standard number','R' UNION ALL
  SELECT '110','1','Real World Object URI','R' UNION ALL
  SELECT '110','2','Source of heading or term','NR' UNION ALL
  SELECT '110','3','Materials specified','NR' UNION ALL
  SELECT '110','4','Relationship','R' UNION ALL
  SELECT '110','5','Institution to which field applies','NR' UNION ALL
  SELECT '110','6','Linkage','NR' UNION ALL
  SELECT '110','7','Data provenance','R' UNION ALL
  SELECT '110','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     111 - Main Entry - Meeting Name (X11)
     --------------------------- */
  SELECT '111','a','Meeting name or jurisdiction name as entry element','NR' UNION ALL
  SELECT '111','c','Location of meeting','NR' UNION ALL
  SELECT '111','d','Date of meeting','NR' UNION ALL
  SELECT '111','e','Subordinate unit','R' UNION ALL
  SELECT '111','f','Date of a work','NR' UNION ALL
  SELECT '111','g','Miscellaneous information','NR' UNION ALL
  SELECT '111','j','Relator term','R' UNION ALL
  SELECT '111','k','Form subheading','R' UNION ALL
  SELECT '111','l','Language of a work','NR' UNION ALL
  SELECT '111','n','Number of meeting','NR' UNION ALL
  SELECT '111','p','Name of part/section of a work','R' UNION ALL
  SELECT '111','q','Name of meeting following jurisdiction name entry element','NR' UNION ALL
  SELECT '111','t','Title of a work','NR' UNION ALL
  SELECT '111','u','Affiliation','NR' UNION ALL
  SELECT '111','0','Authority record control number or standard number','R' UNION ALL
  SELECT '111','1','Real World Object URI','R' UNION ALL
  SELECT '111','2','Source of heading or term','NR' UNION ALL
  SELECT '111','3','Materials specified','NR' UNION ALL
  SELECT '111','4','Relationship','R' UNION ALL
  SELECT '111','5','Institution to which field applies','NR' UNION ALL
  SELECT '111','6','Linkage','NR' UNION ALL
  SELECT '111','7','Data provenance','R' UNION ALL
  SELECT '111','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     246 - Varying Form of Title (Título alterno)
     --------------------------- */
  SELECT '246','a','Title proper/short title','NR' UNION ALL
  SELECT '246','b','Remainder of title','NR' UNION ALL
  SELECT '246','f','Date or sequential designation','NR' UNION ALL
  SELECT '246','g','Miscellaneous information','NR' UNION ALL
  SELECT '246','h','Medium','NR' UNION ALL
  SELECT '246','i','Display text','NR' UNION ALL
  SELECT '246','n','Number of part/section of a work','R' UNION ALL
  SELECT '246','p','Name of part/section of a work','R' UNION ALL
  SELECT '246','5','Institution to which field applies','NR' UNION ALL
  SELECT '246','6','Linkage','NR' UNION ALL
  SELECT '246','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     710 - Added Entry - Corporate Name (X10)
     --------------------------- */
  SELECT '710','a','Corporate name or jurisdiction name as entry element','NR' UNION ALL
  SELECT '710','b','Subordinate unit','R' UNION ALL
  SELECT '710','c','Location of meeting','NR' UNION ALL
  SELECT '710','d','Date of meeting or treaty signing','NR' UNION ALL
  SELECT '710','e','Relator term','R' UNION ALL
  SELECT '710','f','Date of a work','NR' UNION ALL
  SELECT '710','g','Miscellaneous information','NR' UNION ALL
  SELECT '710','i','Relationship information','R' UNION ALL
  SELECT '710','k','Form subheading','R' UNION ALL
  SELECT '710','l','Language of a work','NR' UNION ALL
  SELECT '710','n','Number of part/section/meeting','R' UNION ALL
  SELECT '710','p','Name of part/section of a work','R' UNION ALL
  SELECT '710','t','Title of a work','NR' UNION ALL
  SELECT '710','u','Affiliation','NR' UNION ALL
  SELECT '710','0','Authority record control number or standard number','R' UNION ALL
  SELECT '710','1','Real World Object URI','R' UNION ALL
  SELECT '710','2','Source of heading or term','NR' UNION ALL
  SELECT '710','3','Materials specified','NR' UNION ALL
  SELECT '710','4','Relationship','R' UNION ALL
  SELECT '710','5','Institution to which field applies','NR' UNION ALL
  SELECT '710','6','Linkage','NR' UNION ALL
  SELECT '710','7','Data provenance','R' UNION ALL
  SELECT '710','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     711 - Added Entry - Meeting Name (X11)
     --------------------------- */
  SELECT '711','a','Meeting name or jurisdiction name as entry element','NR' UNION ALL
  SELECT '711','c','Location of meeting','NR' UNION ALL
  SELECT '711','d','Date of meeting','NR' UNION ALL
  SELECT '711','e','Subordinate unit','R' UNION ALL
  SELECT '711','f','Date of a work','NR' UNION ALL
  SELECT '711','g','Miscellaneous information','NR' UNION ALL
  SELECT '711','i','Relationship information','R' UNION ALL
  SELECT '711','j','Relator term','R' UNION ALL
  SELECT '711','k','Form subheading','R' UNION ALL
  SELECT '711','l','Language of a work','NR' UNION ALL
  SELECT '711','n','Number of meeting','NR' UNION ALL
  SELECT '711','p','Name of part/section of a work','R' UNION ALL
  SELECT '711','q','Name of meeting following jurisdiction name entry element','NR' UNION ALL
  SELECT '711','t','Title of a work','NR' UNION ALL
  SELECT '711','u','Affiliation','NR' UNION ALL
  SELECT '711','0','Authority record control number or standard number','R' UNION ALL
  SELECT '711','1','Real World Object URI','R' UNION ALL
  SELECT '711','2','Source of heading or term','NR' UNION ALL
  SELECT '711','3','Materials specified','NR' UNION ALL
  SELECT '711','4','Relationship','R' UNION ALL
  SELECT '711','5','Institution to which field applies','NR' UNION ALL
  SELECT '711','6','Linkage','NR' UNION ALL
  SELECT '711','7','Data provenance','R' UNION ALL
  SELECT '711','8','Field link and sequence number','R' UNION ALL

  /* ---------------------------
     773 - Host Item Entry (artículos dentro de revista/libro)
     --------------------------- */
  SELECT '773','a','Main entry heading' ,'R' UNION ALL
  SELECT '773','b','Edition' ,'R' UNION ALL
  SELECT '773','d','Place, publisher, and date of host item' ,'R' UNION ALL
  SELECT '773','g','Related parts' ,'R' UNION ALL
  SELECT '773','h','Physical description' ,'R' UNION ALL
  SELECT '773','i','Relationship information' ,'R' UNION ALL
  SELECT '773','k','Series data for related item' ,'R' UNION ALL
  SELECT '773','m','Material-specific details' ,'R' UNION ALL
  SELECT '773','n','Note' ,'R' UNION ALL
  SELECT '773','o','Other item identifier' ,'R' UNION ALL
  SELECT '773','p','Abbreviated title' ,'R' UNION ALL
  SELECT '773','q','Enumeration and first page' ,'R' UNION ALL
  SELECT '773','r','Report number' ,'R' UNION ALL
  SELECT '773','s','Uniform title' ,'R' UNION ALL
  SELECT '773','t','Title' ,'R' UNION ALL
  SELECT '773','u','Uniform Resource Identifier' ,'R' UNION ALL
  SELECT '773','w','Record control number' ,'R' UNION ALL
  SELECT '773','x','International Standard Serial Number' ,'R' UNION ALL
  SELECT '773','y','CODEN designation' ,'R' UNION ALL
  SELECT '773','z','International Standard Book Number' ,'R' UNION ALL
  SELECT '773','3','Materials specified' ,'NR' UNION ALL
  SELECT '773','4','Relationship' ,'R' UNION ALL
  SELECT '773','6','Linkage' ,'NR' UNION ALL
  SELECT '773','7','Control subfield' ,'NR' UNION ALL
  SELECT '773','8','Field link and sequence number' ,'R' UNION ALL

  /* ---------------------------
     787 - Nonspecific Relationship Entry (relaciones varias)
     --------------------------- */
  SELECT '787','a','Main entry heading' ,'R' UNION ALL
  SELECT '787','b','Edition' ,'R' UNION ALL
  SELECT '787','c','Qualifying information' ,'R' UNION ALL
  SELECT '787','d','Place, publisher, and date of related item' ,'R' UNION ALL
  SELECT '787','g','Related parts' ,'R' UNION ALL
  SELECT '787','h','Physical description' ,'R' UNION ALL
  SELECT '787','i','Relationship information' ,'R' UNION ALL
  SELECT '787','m','Material-specific details' ,'R' UNION ALL
  SELECT '787','n','Note' ,'R' UNION ALL
  SELECT '787','o','Other item identifier' ,'R' UNION ALL
  SELECT '787','r','Report number' ,'R' UNION ALL
  SELECT '787','s','Uniform title' ,'R' UNION ALL
  SELECT '787','t','Title' ,'R' UNION ALL
  SELECT '787','u','Uniform Resource Identifier' ,'R' UNION ALL
  SELECT '787','w','Record control number' ,'R' UNION ALL
  SELECT '787','x','International Standard Serial Number' ,'R' UNION ALL
  SELECT '787','y','CODEN designation' ,'R' UNION ALL
  SELECT '787','z','International Standard Book Number' ,'R' UNION ALL
  SELECT '787','3','Materials specified' ,'NR' UNION ALL
  SELECT '787','4','Relationship' ,'R' UNION ALL
  SELECT '787','6','Linkage' ,'NR' UNION ALL
  SELECT '787','7','Control subfield' ,'NR' UNION ALL
  SELECT '787','8','Field link and sequence number' ,'R'
) x
WHERE f.Codigo = 'MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Nombre = VALUES(Nombre),
  Repetibilidad = VALUES(Repetibilidad),
  Es_Obsoleto = VALUES(Es_Obsoleto);


/* =========================================================
   SUBCAMPOS - 502 Dissertation Note (Tesis)
   ========================================================= */

INSERT INTO Bib_Marc_Dic_Subcampo
(Id_Formato, Tag, Codigo, Nombre, Repetibilidad, Es_Obsoleto)
SELECT f.Id_Formato, x.Tag, x.Codigo, x.Nombre, x.Rep, 0
FROM Bib_Marc_Dic_Formato f
JOIN (
  SELECT '502' Tag,'a' Codigo,'Dissertation note' Nombre,'R' Rep UNION ALL
  SELECT '502','b','Degree type','R' UNION ALL
  SELECT '502','c','Name of granting institution','R' UNION ALL
  SELECT '502','d','Year degree granted','R' UNION ALL
  SELECT '502','g','Miscellaneous information','R' UNION ALL
  SELECT '502','o','Dissertation identifier','R' UNION ALL
  SELECT '502','q','Name of dissertation or thesis advisor','R' UNION ALL
  SELECT '502','6','Linkage','NR' UNION ALL
  SELECT '502','8','Field link and sequence number','R'
) x
WHERE f.Codigo='MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Nombre = VALUES(Nombre),
  Repetibilidad = VALUES(Repetibilidad),
  Es_Obsoleto = VALUES(Es_Obsoleto);

-- Script MySQL: Diccionario de Indicadores (245, 650, 264, 856)
/* =========================================================
   INDICADORES - DICCIONARIO (245, 650, 264, 856)
   ========================================================= */

INSERT INTO Bib_Marc_Dic_Indicador
(Id_Formato, Tag, Posicion, Valor, Significado)
SELECT f.Id_Formato, x.Tag, x.Posicion, x.Valor, x.Significado
FROM Bib_Marc_Dic_Formato f
JOIN (
  /* ---------------------------
     245 - Title Statement
     Ind1: Added entry (autor/título relacionado)
     --------------------------- */
  SELECT '245' Tag, 1 Posicion, '0' Valor, 'No added entry' Significado UNION ALL
  SELECT '245', 1, '1', 'Added entry' UNION ALL

  /* 245 Ind2: Nonfiling characters (0-9) */
  SELECT '245', 2, '0', 'No nonfiling characters' UNION ALL
  SELECT '245', 2, '1', '1 nonfiling character' UNION ALL
  SELECT '245', 2, '2', '2 nonfiling characters' UNION ALL
  SELECT '245', 2, '3', '3 nonfiling characters' UNION ALL
  SELECT '245', 2, '4', '4 nonfiling characters' UNION ALL
  SELECT '245', 2, '5', '5 nonfiling characters' UNION ALL
  SELECT '245', 2, '6', '6 nonfiling characters' UNION ALL
  SELECT '245', 2, '7', '7 nonfiling characters' UNION ALL
  SELECT '245', 2, '8', '8 nonfiling characters' UNION ALL
  SELECT '245', 2, '9', '9 nonfiling characters' UNION ALL

  /* ---------------------------
     650 - Subject Added Entry - Topical Term
     Ind2: Thesaurus / source of heading
     --------------------------- */
  SELECT '650', 2, '0', 'Library of Congress Subject Headings (LCSH)' UNION ALL
  SELECT '650', 2, '1', 'LC subject headings for children''s literature' UNION ALL
  SELECT '650', 2, '2', 'Medical Subject Headings (MeSH)' UNION ALL
  SELECT '650', 2, '3', 'National Agricultural Library subject authority file' UNION ALL
  SELECT '650', 2, '4', 'Source not specified' UNION ALL
  SELECT '650', 2, '5', 'Canadian Subject Headings (CSH)' UNION ALL
  SELECT '650', 2, '6', 'Répertoire de vedettes-matière (RVM)' UNION ALL
  SELECT '650', 2, '7', 'Source specified in subfield $2' UNION ALL

  /* 650 Ind1 (en muchos sistemas se mantiene como ' ' / 0-3 según tipo de entrada)
     Para operación básica, lo dejamos documentado como "Undefined/blank".
     Si querés ultra-estricto, lo refinamos después. */
  SELECT '650', 1, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     264 - Production, Publication, Distribution, Manufacture, and Copyright
     Ind2: Function of entity
     --------------------------- */
  SELECT '264', 2, '0', 'Production' UNION ALL
  SELECT '264', 2, '1', 'Publication' UNION ALL
  SELECT '264', 2, '2', 'Distribution' UNION ALL
  SELECT '264', 2, '3', 'Manufacture' UNION ALL
  SELECT '264', 2, '4', 'Copyright notice date' UNION ALL

  /* 264 Ind1: Undefined/blank */
  SELECT '264', 1, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     856 - Electronic Location and Access
     Ind2: Relationship (muy útil en UI)
     --------------------------- */
  SELECT '856', 2, '0', 'Resource' UNION ALL
  SELECT '856', 2, '1', 'Version of resource' UNION ALL
  SELECT '856', 2, '2', 'Related resource' UNION ALL
  SELECT '856', 2, '8', 'No display constant generated' UNION ALL

  /* 856 Ind1: Access method (básico)
     (si querés, después lo ampliamos con meanings exactos por método)
  */
  SELECT '856', 1, '0', 'Email' UNION ALL
  SELECT '856', 1, '1', 'FTP' UNION ALL
  SELECT '856', 1, '2', 'Remote login (Telnet)' UNION ALL
  SELECT '856', 1, '3', 'Dial-up' UNION ALL
  SELECT '856', 1, '4', 'HTTP' UNION ALL
  SELECT '856', 1, '7', 'Method specified in subfield $2'
) x
WHERE f.Codigo='MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Significado = VALUES(Significado);


/* =========================================================
   INDICADORES - BLOQUE SIGUIENTE (Nombres + Títulos variantes + Identificadores)
   Tags: 100,110,111,700,710,711,246,024
   Formato: MARC21-BIB
   ========================================================= */

INSERT INTO Bib_Marc_Dic_Indicador
(Id_Formato, Tag, Posicion, Valor, Significado)
SELECT f.Id_Formato, x.Tag, x.Posicion, x.Valor, x.Significado
FROM Bib_Marc_Dic_Formato f
JOIN (

  /* ---------------------------
     100 / 700 - Personal Name (X00)
     Ind1: Type of personal name entry element
     Ind2: Undefined/blank
     --------------------------- */
  SELECT '100' Tag, 1 Posicion, '0' Valor, 'Forename' Significado UNION ALL
  SELECT '100', 1, '1', 'Surname' UNION ALL
  SELECT '100', 1, '3', 'Family name' UNION ALL
  SELECT '100', 2, ' ', 'Undefined/blank' UNION ALL

  SELECT '700', 1, '0', 'Forename' UNION ALL
  SELECT '700', 1, '1', 'Surname' UNION ALL
  SELECT '700', 1, '3', 'Family name' UNION ALL
  SELECT '700', 2, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     110 / 710 - Corporate Name (X10)
     Ind1: Type of corporate name entry element
     Ind2: Undefined/blank
     --------------------------- */
  SELECT '110', 1, '0', 'Inverted name' UNION ALL
  SELECT '110', 1, '1', 'Jurisdiction name' UNION ALL
  SELECT '110', 1, '2', 'Name in direct order' UNION ALL
  SELECT '110', 2, ' ', 'Undefined/blank' UNION ALL

  SELECT '710', 1, '0', 'Inverted name' UNION ALL
  SELECT '710', 1, '1', 'Jurisdiction name' UNION ALL
  SELECT '710', 1, '2', 'Name in direct order' UNION ALL
  SELECT '710', 2, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     111 / 711 - Meeting Name (X11)
     Ind1: Type of meeting name entry element
     Ind2: Undefined/blank
     --------------------------- */
  SELECT '111', 1, '0', 'Inverted name' UNION ALL
  SELECT '111', 1, '1', 'Jurisdiction name' UNION ALL
  SELECT '111', 1, '2', 'Name in direct order' UNION ALL
  SELECT '111', 2, ' ', 'Undefined/blank' UNION ALL

  SELECT '711', 1, '0', 'Inverted name' UNION ALL
  SELECT '711', 1, '1', 'Jurisdiction name' UNION ALL
  SELECT '711', 1, '2', 'Name in direct order' UNION ALL
  SELECT '711', 2, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     246 - Varying Form of Title
     Ind1: Note/added entry controller
     Ind2: Type of title
     --------------------------- */
  SELECT '246', 1, '0', 'Note, no added entry' UNION ALL
  SELECT '246', 1, '1', 'Note, added entry' UNION ALL
  SELECT '246', 1, '2', 'No note, no added entry' UNION ALL
  SELECT '246', 1, '3', 'No note, added entry' UNION ALL

  SELECT '246', 2, ' ', 'No type specified' UNION ALL
  SELECT '246', 2, '0', 'Portion of title' UNION ALL
  SELECT '246', 2, '1', 'Parallel title' UNION ALL
  SELECT '246', 2, '2', 'Distinctive title' UNION ALL
  SELECT '246', 2, '3', 'Other title' UNION ALL
  SELECT '246', 2, '4', 'Cover title' UNION ALL
  SELECT '246', 2, '5', 'Added title page title' UNION ALL
  SELECT '246', 2, '6', 'Caption title' UNION ALL
  SELECT '246', 2, '7', 'Running title' UNION ALL
  SELECT '246', 2, '8', 'Spine title' UNION ALL

  /* ---------------------------
     024 - Other Standard Identifier
     Ind1: Type of standard number or code
     Ind2: Undefined/blank
     --------------------------- */
  SELECT '024', 1, '0', 'International Standard Recording Code (ISRC)' UNION ALL
  SELECT '024', 1, '1', 'Universal Product Code (UPC)' UNION ALL
  SELECT '024', 1, '2', 'International Standard Music Number (ISMN)' UNION ALL
  SELECT '024', 1, '3', 'International Article Number (EAN)' UNION ALL
  SELECT '024', 1, '4', 'Serial Item and Contribution Identifier (SICI)' UNION ALL
  SELECT '024', 1, '7', 'Source specified in subfield $2' UNION ALL
  SELECT '024', 1, '8', 'Unspecified type of standard number or code' UNION ALL
  SELECT '024', 2, ' ', 'Undefined/blank'

) x
WHERE f.Codigo='MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Significado = VALUES(Significado);


/* =========================================================
   INDICADORES - BLOQUE SIGUIENTE (490, 830, y Undefined/blank comunes)
   Formato: MARC21-BIB
   ========================================================= */

INSERT INTO Bib_Marc_Dic_Indicador
(Id_Formato, Tag, Posicion, Valor, Significado)
SELECT f.Id_Formato, x.Tag, x.Posicion, x.Valor, x.Significado
FROM Bib_Marc_Dic_Formato f
JOIN (

  /* ---------------------------
     490 - Series Statement
     Ind1: Series traced or not traced
     Ind2: Undefined/blank
     --------------------------- */
  SELECT '490' Tag, 1 Posicion, '0' Valor, 'Series not traced' Significado UNION ALL
  SELECT '490', 1, '1', 'Series traced' UNION ALL
  SELECT '490', 2, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     830 - Series Added Entry - Uniform Title
     Ind1: Undefined/blank
     Ind2: Nonfiling characters (0-9)
     --------------------------- */
  SELECT '830' Tag, 1 Posicion, ' ', 'Undefined/blank' Significado UNION ALL
  SELECT '830', 2, '0', 'No nonfiling characters' UNION ALL
  SELECT '830', 2, '1', '1 nonfiling character' UNION ALL
  SELECT '830', 2, '2', '2 nonfiling characters' UNION ALL
  SELECT '830', 2, '3', '3 nonfiling characters' UNION ALL
  SELECT '830', 2, '4', '4 nonfiling characters' UNION ALL
  SELECT '830', 2, '5', '5 nonfiling characters' UNION ALL
  SELECT '830', 2, '6', '6 nonfiling characters' UNION ALL
  SELECT '830', 2, '7', '7 nonfiling characters' UNION ALL
  SELECT '830', 2, '8', '8 nonfiling characters' UNION ALL
  SELECT '830', 2, '9', '9 nonfiling characters' UNION ALL

  /* ---------------------------
     020 - ISBN
     Ind1/Ind2: Undefined/blank
     --------------------------- */
  SELECT '020', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '020', 2, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     022 - ISSN
     Ind1: Level of international interest (en muchos entornos se deja blank)
     Ind2: Undefined/blank
     Para diccionario operativo, permitimos blank en ambos.
     --------------------------- */
  SELECT '022', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '022', 2, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     773 - Host Item Entry
     Ind1/Ind2: Undefined/blank (operativo)
     --------------------------- */
  SELECT '773', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '773', 2, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     787 - Nonspecific Relationship Entry
     Ind1/Ind2: Undefined/blank (operativo)
     --------------------------- */
  SELECT '787', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '787', 2, ' ', 'Undefined/blank' UNION ALL

  /* ---------------------------
     Campos de notas y descripción (comunes)
     300, 500, 502, 505, 520: Ind1/Ind2 Undefined/blank
     --------------------------- */
  SELECT '300', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '300', 2, ' ', 'Undefined/blank' UNION ALL

  SELECT '500', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '500', 2, ' ', 'Undefined/blank' UNION ALL

  SELECT '502', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '502', 2, ' ', 'Undefined/blank' UNION ALL

  SELECT '505', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '505', 2, ' ', 'Undefined/blank' UNION ALL

  SELECT '520', 1, ' ', 'Undefined/blank' UNION ALL
  SELECT '520', 2, ' ', 'Undefined/blank'

) x
WHERE f.Codigo='MARC21-BIB'
ON DUPLICATE KEY UPDATE
  Significado = VALUES(Significado);
