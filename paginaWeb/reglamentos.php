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
                        <h1 class="display-6 mb-4">Reglamentos Institucionales</h1>
                        <p>
                            Aquí puedes consultar los reglamentos oficiales de la universidad.  
                            Selecciona el documento para visualizarlo sin consumir memoria innecesaria,
                            ya que solo se cargará cuando lo abras.
                        </p>
                    </div>
                </div>

                <div col-lg-6 wow fadeInUp>
                        <details class="reg-item">
                            <summary>Reglamento Academico</summary>
                            <p>
                                <iframe data-src="/reglamentos/Reglamento_Academico.pdf" width="100%" height="800px" frameborder="0"></iframe>
                            </p>
                        </details>
                        <details class="reg-item">
                            <summary>Reglamento de Becas</summary>
                            <p>
                                <iframe data-src="/reglamentos/Reglamento_Becas.pdf" width="100%" height="800px" frameborder="0"></iframe>
                            </p>
                        </details>
                        <details class="reg-item">
                            <summary>Reglamento de Vida Estudiantil</summary>
                            <p>
                                <iframe data-src="/reglamentos/Reglamento_Vida_Estudiantil.pdf" width="100%" height="800px" frameborder="0"></iframe>
                            </p>
                        </details>
                        <details class="reg-item">
                            <summary>Reglamento de Evaluación</summary>
                            <p>
                                <iframe data-src="/reglamentos/Reglamento_de_Evaluacion.pdf" width="100%" height="800px" frameborder="0"></iframe>
                            </p>
                        </details>
                         <details class="reg-item">
                            <summary>Reglamento de Trabajo Comunal Universitario</summary>
                            <p>
                                <iframe data-src="/reglamentos/Reglamento_Trabajo_Comunal.pdf" width="100%" height="800px" frameborder="0"></iframe>
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
<script>
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('details').forEach(function (det) {
    det.addEventListener('toggle', function () {
      var iframe = det.querySelector('iframe');
      if (!iframe) return;

      if (det.open) {
        // Si se abre y aún no se ha cargado el PDF
        if (!iframe.src) {
          iframe.src = iframe.dataset.src;
        }
      } else {
        // Opcional: si quieres liberar memoria al cerrarlo
        // (ten en cuenta que al volver a abrirlo se recarga)
        // iframe.src = '';
      }
    });
  });
});
</script>
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