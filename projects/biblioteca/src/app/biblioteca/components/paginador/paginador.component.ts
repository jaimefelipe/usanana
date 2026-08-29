import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css']
})
export class PaginadorComponent {
  @Input() paginaActual = 1;
  @Input() totalPaginas = 0;
  @Input() paginasVisibles: number[] = [];
  @Input() rangeStart = 0;
  @Input() rangeEnd = 0;
  @Input() total = 0;
  @Input() etiqueta = 'resultados';
  @Output() cambio = new EventEmitter<number>();

  irAPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas || pagina === this.paginaActual) {
      return;
    }
    this.cambio.emit(pagina);
  }
}
