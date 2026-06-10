<?php
$host = $_SERVER['HTTP_HOST']; // brenes.net
include_once(__DIR__ . '/core/db/epsMySqlDataBase_v2.php');
$Id = isset($_GET['Id']) ? intval($_GET['Id']) : 0;


$db = epsMySqlDatabase::GetInstance();

$sql1 = "SELECT Codigo,Carrera,Descripcion,Requisito,Duracion,Creditos, Nivel FROM Edu_Carrera WHERE Id_Empresa = 1 and Estado = 1 and Id_Carrera = ".$Id;

$db->Execute($sql1);
$carreras = $db->getData();

//Leer los cursos de la carrera.
$sql2 = "SELECT Id_Curso_Carrera,Edu_Curso_Carrera.Id_Curso,Bloque, Codigo, Curso FROM Edu_Curso_Carrera inner Join Edu_Curso on Edu_Curso_Carrera.Id_Curso = Edu_Curso.Id_Curso WHERE Edu_Curso_Carrera.Id_Empresa = 1 and Estado = 1 and Id_Carrera = ".$Id;
$db->Execute($sql2); 
$cursos = $db->getData();


require_once('header.php');
?>
<!-- Testimonial Start -->
    <div class="container-xxl py-6">
        <div class="">
            <div class="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 900px;">
                <h6 class="display-6 mb-4"><?php echo $carreras[0]['Codigo']?></h>
                <h1 class="text-primary text-uppercase mb-2"><?php echo $carreras[0]['Carrera']?></h1>
                
            </div>
            <div class="row ">
                <div class="col-lg-12 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="owl-carousel testimonial-carousel">
                        <div class="testimonial-item">
                            
                            <p class="fs-4"><?php echo $carreras[0]['Descripcion']?></p>
                            <hr class="w-25 mx-auto">
                            
                            <p class="fs-4"><?php echo $carreras[0]['Requisito']?></p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 900px;">
                        <h5 class="display-6 mb-4">Duración</h5>
                        <h2 class="text-primary text-uppercase mb-2"><?php echo $carreras[0]['Duracion']?></h2>
                        
                    </div>
                </div>
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 900px;">
                        <h5 class="display-6 mb-4">Créditos</h5>
                        <h2 class="text-primary text-uppercase mb-2"><?php echo $carreras[0]['Creditos']?></h2>
                        
                    </div>
                </div>

            </div>
        </div>
    </div>
    <!-- Testimonial End -->
    <!-- Courses Start -->
    <div class="container-xxl ">
        <div class="1">
            <div class="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style="max-width: 900px;">
                <h6 class="display-6 mb-4">Cursos de la Carrera</h6>
                <h1 class="text-primary text-uppercase mb-2">Plan de Estudios</h1>
                
            </div>
            <div class="row g-4">
                <?php
                    foreach ($cursos as $Curso) {
                ?>
                <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="courses-item d-flex flex-column bg-light overflow-hidden h-100">
                        <div class="text-center p-4 pt-0">
                            <div class="d-inline-block bg-primary text-white fs-5 py-1 px-4 mb-4"></div>
                            <h5 class="mb-3"><?php echo $Curso['Codigo']?> - <?php echo $Curso['Curso']?></h5>
                            <ol class="text-start breadcrumb justify-content-center mb-0">
                                <li class="breadcrumb   -item small"><i class="fa fa-signal text-primary me-2"></i>Bloque: <?php echo $Curso['Bloque']?></li>
                            </ol>
                        </div>
                    </div>
                </div>
                <?php 
                    } // Fin del foreach cursos
                ?>
            </div>
        </div>
    </div>
    <!-- Courses End -->
<?
require_once('footer.php');
?>
