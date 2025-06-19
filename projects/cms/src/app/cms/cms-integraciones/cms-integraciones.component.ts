import { Component, OnInit } from '@angular/core';
import { CmsIntegracionesService } from './cms-integraciones.service';

@Component({
  selector: 'app-cms-integraciones',
  templateUrl: './cms-integraciones.component.html',
  styleUrls: ['./cms-integraciones.component.css']
})
export class CmsIntegracionesComponent implements OnInit {

  Id_Empresa = 1; // ← ajustá según el entorno activo
  Integraciones: any[] = [];
  Integracion: any = {};
  edit = false;

  tipos = ['LMS', 'CRM', 'WHATSAPP', 'ERP', 'API'];

  constructor(private integracionService: CmsIntegracionesService) {}

  async ngOnInit() {
    await this.cargarIntegraciones();
  }

  async cargarIntegraciones() {
    const result = await this.integracionService.loadIntegraciones(this.Id_Empresa);
    this.Integraciones = result?.data || [];
  }

  nuevaIntegracion() {
    this.Integracion = {
      Id_Empresa: this.Id_Empresa,
      Tipo_Integracion: '',
      Url_Conexion: '',
      Token_API: '',
      Estado: true,
      Notas: ''
    };
    this.edit = true;
  }

  editarIntegracion(integ: any) {
    this.Integracion = { ...integ };
    this.edit = true;
  }

  async grabar() {
    await this.integracionService.guardarIntegracion(this.Integracion);
    this.cancelar();
    await this.cargarIntegraciones();
  }

  cancelar() {
    this.edit = false;
    this.Integracion = {};
  }

  async eliminar(Id_Integracion: number) {
    if (confirm('¿Seguro que desea eliminar esta integración?')) {
      await this.integracionService.eliminarIntegracion(Id_Integracion);
      await this.cargarIntegraciones();
    }
  }
}
