import { Component, OnInit,Input  } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-recurso-pdf',
  templateUrl: './recurso-pdf.component.html',
  styleUrls: ['./recurso-pdf.component.css']
})
export class RecursoPdfComponent implements OnInit {

  @Input() item: any;

  constructor(private sanitizer: DomSanitizer) {}
  
  ngOnInit() {
  }
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://usantana.com/"+ url);
  }

  isPdfVisible(): boolean {
    return this.item.Contenido?.toLowerCase().endsWith('.pdf');
  }


}
