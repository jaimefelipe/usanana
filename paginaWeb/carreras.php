<?php
$host = $_SERVER['HTTP_HOST']; // brenes.net
include_once(__DIR__ . '/core/db/epsMySqlDataBase_v2.php');
$db = epsMySqlDatabase::GetInstance();

$sql1 = "SELECT Id_Carrera,Carrera,Descripcion,Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 and Estado = 1 and Id_Facultad = 1 and Id_Escuela = 1";
$sql2 = "SELECT Id_Carrera,Carrera,Descripcion,Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 and Estado = 1 and Id_Facultad = 2 and Id_Escuela = 2";
$sql3 = "SELECT Id_Carrera,Carrera,Descripcion,Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 and Estado = 1 and Id_Facultad = 2 and Id_Escuela = 3";
$sql4 = "SELECT Id_Carrera,Carrera,Descripcion,Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 and Estado = 1 and Id_Facultad = 3 and Id_Escuela = 3";
$sql5 = "SELECT Id_Carrera,Carrera,Descripcion,Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 and Estado = 1 and Id_Facultad = 4 and Id_Escuela = 4";

$db->Execute($sql1);
$carreras1 = $db->getData();
$db->Execute($sql2);
$carreras2 = $db->getData();
$db->Execute($sql3);
$carreras3 = $db->getData();
$db->Execute($sql4);
$carreras4 = $db->getData();
$db->Execute($sql5);
$carreras5 = $db->getData();

require_once('header.php');
?>

    <!-- Page Header Start -->
    <div class="container-fluid page-header py-6 my-6 mt-0 wow fadeIn" data-wow-delay="0.1s">
        <div class="container text-center">
            <h1 class="display-4 text-white animated slideInDown mb-4">Carreras</h1>
            <nav aria-label="breadcrumb animated slideInDown">
                <ol class="breadcrumb justify-content-center mb-0">
                    <li class="breadcrumb-item"><a class="text-white" href="#">Inicio</a></li>
                    <li class="breadcrumb-item text-primary active" aria-current="page">Carreras</li>
                </ol>
            </nav>
        </div>
    </div>
    <div class="row">
    <!-- Page Header End -->
    <?php
        for ($i = 1; $i <= 5; $i++) {
            
    ?>

   
       <div class="col-lg-6 ">
 
    <!-- Courses Start -->

            <div class="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s">
                <?php
                    switch ($i) {
                        case 1:
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">FACULTAD DE EDUCACIÓN Y HUMANIDADES DIGITALES</h6>';
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">Escuela de Educación y Mediación Digital</h6></h6>';
                            $carreras = $carreras1;
                            break;

                        case 2:
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">FACULTAD DE TEOLOGÍA COMPARADA Y ESTUDIOS INTERRELIGIOSOS</h6>';
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">Escuela de Estudios Teológicos y Diálogo Inter-Epistémico</h6></h6>';
                            $carreras = $carreras2;
                            break;

                        case 3:
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">Escuela de Teología Aplicada y Liderazgo Intercultural</h6></h6>';
                            
                            $carreras = $carreras3;
                            break;

                        case 4:
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">FACULTAD DE CIENCIAS ECONÓMICAS Y GESTIÓN ORGANIZACIONAL </h6>';
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">Escuela de Administración</h6></h6>';
                            
                            $carreras = $carreras4;
                            break;

                        case 5:
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">FACULTAD DE SABERES INTEGRATIVOS Y BIENESTAR HUMANO</h6>';
                            echo '<h6 class="text-primary text-uppercase mb-2"><h6 class="text-primary text-uppercase mb-2">Escuela de Administración del Bienestar</h6></h6>';
                            
                            $carreras = $carreras5;
                            break;

                        default:
                            echo "Fuera de rango<br>";
                            break;
                }
                        
                ?>
                        
            </div>
            <div class="row g-4 justify-content-center">
                
                <?php 
                
                    foreach ($carreras as $Carrera) {
                ?>
            
                <div class="wow fadeInUp" data-wow-delay="0.1s">
                    <div class="courses-item d-flex flex-column bg-light overflow-hidden h-100">
                        <div class="text-center p-4 pt-0">
                            <div class="d-inline-block bg-primary text-white fs-5 py-1 px-4 mb-4"></div>
                            <h5 class="mb-3"><?echo $Carrera['Carrera'];?></h5>
                            <p><?echo substr($Carrera['Descripcion'], 0, 200);echo '...'?></p>
                            <ol class="breadcrumb justify-content-center mb-0">
                                <li class="breadcrumb-item small"><i class="fa fa-signal text-primary me-2"></i>
                                <?php
                                    if($Carrera['Nivel'] == 7){
                                        echo 'Licenciatura';
                                    }else{
                                        echo 'Maestria';
                                    }
                                
                                ?>
                                </li>
                            
                            </ol>
                             <a class="btn btn-outline-primary border-2" href="/carrera.php?Id=<?php echo $Carrera['Id_Carrera'];?>">Mas Información</a>
                        </div>
                       
                    </div>
                </div>

                <?php 
                    } // Fin del foreach carreras
                ?>

                
            </div>

    <!-- Courses End -->

        </div>

     <?php
        } // Fin del for      
    ?>
    </div>
<?
require_once('footer.php');
?>
