<?
require_once('header.php');
?>

 <!-- About Start -->
    <div class="container-xxl py-6">
        <div class="container">
            <div class="row g-5">
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="position-relative overflow-hidden ps-5 pt-5 h-100" style="min-height: 400px;">
                        <img class="position-absolute w-100 h-100" src="img/about-1.png" alt="" style="object-fit: cover;">
                        <img class="position-absolute top-0 start-0 bg-white pe-3 pb-3" src="img/about-2.png" alt="" style="width: 200px; height: 200px;">
                    </div>
                </div>
                <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.5s">
                    <div class="h-100">
                        <h1 class="display-6 mb-4">Bibliotecas</h1>
                        <p>
                            Aquí puedes consultar las biblitecas oficiales de la universidad.  
                            Selecciona el enlace para visualizarlo sin consumir memoria innecesaria,
                            ya que solo se cargará cuando lo abras.
                        </p>
                    </div>
                </div>

                <div col-lg-6 wow fadeInUp>
                        <details class="reg-item">
                            <summary>Catholiciu</summary>
                            <p>
                                <a href="https://library.catholiciu.edu/OA_Resources" target="_blank">--- Library.catholiciu.edu</a>
                                
                            </p>
                        </details> 
                        <details class="reg-item">
                            <summary>Libguides</summary>
                            <p>
                                <a href="https://libguides.thedtl.org/oadtl/databases" target="_blank">--- Libguides</a>
                                
                            </p>
                        </details>
                         <details class="reg-item">
                            <summary>Scielo</summary>
                            <p>
                                <a href="https://scielo.org/es/" target="_blank">--- Scielo</a>
                                
                            </p>
                        </details>
                        <details class="reg-item">
                            <summary>Redalyc</summary>
                            <p>
                                <a href="https://www.redalyc.org/" target="_blank">--- Redalyc</a>
                                
                            </p>
                        </details>
                        <details class="reg-item">
                            <summary>doaj</summary>
                            <p>
                                <a href="https://doaj.org/" target="_blank">--- Doaj</a>
                                
                            </p>
                        </details>
                </div>
            </div>

        </div>
    </div>
    <!-- About End -->


<?
require_once('footer.php');

?>

<style>
    /* Contenedor general (opcional, por si quieres ajustar margen) */
.col-lg-6 .reg-item {
    margin-bottom: 10px;
}

/* Caja del item */
.reg-item {
    background: #f8f9fa;          /* gris muy claro */
    border: 1px solid #e9ecef;    /* borde suave */
    border-radius: 6px;           /* esquinas redondeadas */
    overflow: hidden;             /* para que el iframe quede “dentro” */
}

/* Ocultar el triángulo feo por defecto */
.reg-item summary::-webkit-details-marker {
    display: none;
}
.reg-item summary::marker {
    content: "";
}

/* Cabecera (la banda gris donde está el texto) */
.reg-item summary {
    padding: 12px 16px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #495057;
    display: flex;
    align-items: center;
}

/* Flechita personalizada */
.reg-item summary::before {
    content: "▸";
    margin-right: 8px;
    transition: transform 0.2s;
    font-size: 0.9rem;
}

/* Girar flechita cuando está abierto */
.reg-item[open] summary::before {
    transform: rotate(90deg);
}

/* Contenido (iframe) */
.reg-item p {
    margin: 0;
}

.reg-item iframe {
    border: 0;
    border-top: 1px solid #e9ecef;
}
</style>