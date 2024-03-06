import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'academico';
  logedIn = false;
  ngOnInit() {
    if(localStorage.getItem('isLoggedin') == "true") {
      this.logedIn = true;
    }else{
      this.logedIn = false;
    }
  }
}
 