import { Component, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aula-virtual-general',
  templateUrl: './aula-virtual-general.component.html',
  styleUrls: ['./aula-virtual-general.component.css']
})
export class AulaVirtualGeneralComponent implements OnInit, OnChanges {

  @Input() Aula: any;
  @Input() Grupos: any[] = [];
  @Output() imagenSeleccionada = new EventEmitter<File | null>();

  imagenPreviewUrl: string | null = null;
  imagenFileName = '';
  readonly imagenAulaDefault = 'assets/nofoto.jpg';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.imagenPreviewUrl = null;
    this.imagenFileName = '';
  }

  handleImagenInput(event: Event){
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];

    if(!file){
      this.imagenSeleccionada.emit(null);
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const extensionesValidas = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const tiposValidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if(!extensionesValidas.includes(extension || '') || !tiposValidos.includes(file.type)){
      Swal.fire('Solo se permiten imagenes JPG, PNG, WEBP o GIF');
      input.value = '';
      this.imagenSeleccionada.emit(null);
      return;
    }

    this.imagenFileName = file.name;
    this.imagenPreviewUrl = URL.createObjectURL(file);
    this.imagenSeleccionada.emit(file);
  }

  quitarImagen(){
    this.Aula.Imagen = '';
    this.imagenPreviewUrl = null;
    this.imagenFileName = '';
    this.imagenSeleccionada.emit(null);
  }

  getImagenAula(){
    const imagen = this.imagenPreviewUrl || this.Aula?.Imagen || this.Aula?.ImagenCurso || '';
    if(!imagen){
      return this.imagenAulaDefault;
    }
    if(imagen.startsWith('http') || imagen.startsWith('assets/')){
      return imagen;
    }
    return 'https://usantana.com' + (imagen.startsWith('/') ? imagen : '/' + imagen);
  }

  usarImagenAulaDefault(event: Event){
    const img = event.target as HTMLImageElement;
    img.src = this.imagenAulaDefault;
  }
}
