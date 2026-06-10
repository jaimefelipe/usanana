import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { SemanaDetalleService } from './semana-detalle.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-semana-detalle',
  templateUrl: './semana-detalle.component.html',
  styleUrls: ['./semana-detalle.component.css']
})
export class SemanaDetalleComponent implements OnInit {

  @Input() semana: any;

  recursos: any[] = [];
  actividades: any[] = [];
  entregas: any[] = [];

  constructor(
    private semanaDetalleService:SemanaDetalleService,
    private route:Router
    ) {}

  ngOnInit(): void {
    
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['semana']) {
      const current: any = changes['semana'].currentValue;
      const previous: any = changes['semana'].previousValue;
      
      // Verificar si cambió el Id_Semana (incluyendo primera carga)
      if (!previous || current.Id_Semana !== previous.Id_Semana) {
        this.LeerRecursos();
        this.leerActividades();
      }
    }
  }
  async LeerRecursos(){
    let data = await this.semanaDetalleService.leerRecursosSemana(this.semana.Id_Semana);
    this.recursos = data['data'];
  }
  async leerActividades(){
    let data = await this.semanaDetalleService.leerActividadesSemana(this.semana.Id_Semana)
    this.actividades = data['data'];
  }
  seleccionarSemana(semana){
    localStorage.setItem('Id_Semana',semana.Id_Semana);
    this.route.navigate(['/semana']);
  }
}
