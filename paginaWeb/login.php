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
                        <h6 class="text-primary text-uppercase mb-2">Sistema académico</h6>
                        <h1 class="display-6 mb-4">Entrar</h1>
                        

                        <form>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="email" class="form-control border-0 bg-light" id="email" placeholder="Correo">
                                        <label for="email">Correo</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-floating">
                                        <input type="password" class="form-control border-0 bg-light" id="name" placeholder="Contraseña">
                                        <label for="name">Contraseña</label>
                                    </div>
                                </div>


                                <div class="col-12">
                                    <button class="btn btn-primary py-3 px-5" type="submit">Ingresar</button>
                                </div>
                                </div>Click <a href="javascript:void(0)" id="to-recover" class="text-dark ">aquí</a> si olvidaste tu contraseña
                                </div>
                            </div>
                        </form>




                                               
                    </div>
                </div>

                

            </div>
        </div>
    </div>
    <!-- About End -->
<?
require_once('footer.php');
?>
