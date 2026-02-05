import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-detalle',
  templateUrl: './opac-detalle.component.html',
  styleUrls: ['./opac-detalle.component.css']
})
export class OpacDetalleComponent implements OnInit {
  libro?: Libro;

  constructor(
    private route: ActivatedRoute,
    private dataService: BibliotecaDataService
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : undefined;
    if (id) {
      this.libro = await this.dataService.getLibroById(id);
    }
  }

  async reservar() {
    if (!this.libro) return;
    try {
      await this.dataService.createReserva(this.libro.id);
      Swal.fire('Reserva creada');
    } catch (error) {
      console.error(error);
      Swal.fire('No se pudo crear la reserva');
    }
  }
}
